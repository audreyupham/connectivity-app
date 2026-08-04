import express from "express";
import { register, login, getMe, logout, refresh } from "../controllers/authController.js";
import authMiddleware from "../middleware/authMiddleware.js"

const router = express.Router();

router.post("/register", register);
router.post("/login", login);

//protected routes
router.get("/me", authMiddleware, getMe);
router.post("/logout", authMiddleware, logout);
router.post("/refresh", authMiddleware, refresh);

export default router;