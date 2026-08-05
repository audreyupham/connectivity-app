import express from "express";
import { updateUser } from "../controllers/usersController.js";
import authMiddleware from "../middleware/authMiddleware.js"

const router = express.Router();

router.put("/", authMiddleware, updateUser);

export default router;