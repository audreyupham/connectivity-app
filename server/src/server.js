import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";

import usersRouter from "./routes/users.js";
import authRouter from "./routes/auth.js";
import errorHandler from "./middleware/errorHandler.js";
import contactsRouter from "./routes/contacts.js";

const app = express();

const PORT = process.env.PORT || 3001;

const uploadsDir = path.join(
process.cwd(),
"src",
"uploads"
);

// ---------- Middleware ----------

app.use(
cors({
origin: process.env.FRONTEND_URL || "http://localhost:5173",
credentials: true
})
);

// Serve uploaded images
app.use(
"/uploads",
express.static(uploadsDir)
);

app.use(express.json());
app.use(cookieParser());

// ---------- Routes ----------

app.use("/auth", authRouter);
app.use("/users", usersRouter);
app.use("/contacts", contactsRouter);

// ---------- Health Check ----------

app.get("/health", (req, res) => {
res.status(200).json({
status: "ok"
});
});

// ---------- Root ----------

app.get("/", (req, res) => {
res.send("Backend is running");
});

// ---------- Error Handler ----------

app.use(errorHandler);

// ---------- Start Server ----------

app.listen(PORT, "0.0.0.0", () => {
console.log(`Server is running on port ${PORT}`);
console.log(`Uploads directory: ${uploadsDir}`);
});