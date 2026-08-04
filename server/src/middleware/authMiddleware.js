import jwt from "jsonwebtoken";
import prisma from "../db.js";

export default async function authMiddleware(req, res, next) {
  try {
    const header = req.headers.authorization;
    if (!header) return res.status(401).json({ error: "No token provided" });

    const token = header.split(" ")[1];
    if (!token) return res.status(401).json({ error: "Invalid token format" });

    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const user = await prisma.user.findUnique({ where: { id: decoded.id } });
    if (!user) return res.status(401).json({ error: "User not found" });

    req.user = { id: user.id, email: user.email, name: user.name };

    next();
  } catch (err) {
    console.error("Auth error:", err);
    res.status(401).json({ error: "Unauthorized" });
  }
}