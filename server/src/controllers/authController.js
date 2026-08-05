import prisma from "../db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { sendPasswordResetEmail } from "../../../src/utils/email.js";


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
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000
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
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });
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

//request-pw-reset
export async function requestPasswordReset(req, res) {
  try {
    const { email } = req.body;

    const user = await prisma.user.findUnique({
      where: { email },
    });

    // Don't reveal whether the email exists
    if (!user) {
      return res.json({
        message: "If that email exists, a reset link has been sent.",
      });
    }

    const token = crypto.randomBytes(32).toString("hex");

    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetToken: token,
        resetExpires: new Date(Date.now() + 1000 * 60 * 30), // 30 minutes
      },
    });

    // send email containing:
    // https://localhost:5173/reset-password/${token}
    await sendPasswordResetEmail(user.email, token);

    return res.json({
      message: "If that email exists, a reset link has been sent."
    });
  } catch (err) {
      console.error("Password reset request error:", err);
      res.status(500).json({
        error: "Unable to process password reset."
      });
  }

}

//reset-password
export async function resetPassword(req, res) {
  try {
    const { token, password } = req.body;

    const user = await prisma.user.findFirst({
      where: {
        resetToken: token,
        resetExpires: {
          gt: new Date(),
        },
      },
    });

    if (!user) {
      return res.status(400).json({
        error: "Invalid or expired reset token",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetExpires: null,
      },
    });

    res.json({
      message: "Password updated successfully.",
    });
  } catch (err) {
    console.error("Password reset request error:", err);
    res.status(500).json({
      error: "Unable to process password reset."
    });
  }
}