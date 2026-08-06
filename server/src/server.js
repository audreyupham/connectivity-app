import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import usersRouter from "./routes/users.js";
import authRouter from "./routes/auth.js";
import errorHandler from "./middleware/errorHandler.js";
import contactsRouter from "./routes/contacts.js";

import path from "path";


const app = express();
const PORT = 3001;

// Middleware
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

app.use(
  "/uploads",
  express.static("src/uploads")
);

app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/auth", authRouter);
app.use("/users", usersRouter);
app.use("/contacts", contactsRouter);

// Health check
app.get("/", (req, res) => {
  res.send("Backend is running");
});

// Error handler (must be last)
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});