import express from "express";
import { createUser, getUser, updateUser } from "../controllers/usersController.js";
import authMiddleware from "../middleware/authMiddleware.js"

const router = express.Router();

router.post("/", createUser);
router.get("/:id", authMiddleware, getUser);
router.put("/:id", authMiddleware, updateUser);

export default router;