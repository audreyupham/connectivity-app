import express from "express";
import { register, login, getMe, logout, refresh, requestPasswordReset, resetPassword, acceptTerms } from "../controllers/authController.js";
import authMiddleware from "../middleware/authMiddleware.js"

const router = express.Router();

router.post("/register", register);
router.post("/login", login);

//protected routes
router.get("/me", authMiddleware, getMe);
router.post("/logout", authMiddleware, logout);
router.post("/refresh", refresh);
router.post("/reset-request", requestPasswordReset);
router.post("/reset-password", resetPassword);
router.post("/accept-terms", authMiddleware, acceptTerms);

export default router;