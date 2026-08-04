import prisma from "../db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// Helper to generate tokens
function generateAccessToken(user) {
  return jwt.sign({ id: user.id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "15m" });
}

function generateRefreshToken(user) {
  return jwt.sign({ id: user.id }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "7d" });
}


//register()
export async function register(req, res) {
  try {
    const { email, password, name } = req.body;

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return res.status(400).json({ error: "Email already exists" });

    const hashed = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: { email, password: hashed, name }
    });

    res.json({ id: user.id, email: user.email, name: user.name });
  } catch (err) {
    console.error("Error registering user:", err);
    res.status(500).json({ error: "Failed to register user" });
  }
}

//login()
export async function login(req, res) {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(400).json({ error: "Invalid credentials" });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(400).json({ error: "Invalid credentials" });

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    // Set refresh token cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    res.json({
      accessToken,
      user: { id: user.id, email: user.email, name: user.name }
    });
  } catch (err) {
    console.error("Error logging in:", err);
    res.status(500).json({ error: "Failed to log in user" });
  }
}

//getMe()
export async function getMe(req, res) {
  res.json(req.user);
}

//logout()
export async function logout(req, res) {
  res.clearCookie("refreshToken");
  res.json({message: "Logged out"});
}

//refresh
export async function refresh(req, res) {
  try {
    const token = req.cookies.refreshToken;
    if (!token) return res.status(401).json({ error: "No refresh token" });

    const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);

    const user = await prisma.user.findUnique({ where: { id: decoded.id } });
    if (!user) return res.status(401).json({ error: "Invalid refresh token" });

    const accessToken = generateAccessToken(user);

    res.json({ accessToken });
  } catch (err) {
    console.error("Error refreshing token:", err);
    res.status(401).json({ error: "Invalid refresh token" });
  }
}