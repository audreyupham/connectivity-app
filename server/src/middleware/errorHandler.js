// middleware/errorHandler.js

export default function errorHandler(err, req, res, next) {
  console.error("Error:", err);

  // Prisma unique constraint error (e.g., duplicate email)
  if (err.code === "P2002") {
    return res.status(400).json({
      error: "A record with this value already exists."
    });
  }

  // JWT errors
  if (err.name === "JsonWebTokenError") {
    return res.status(401).json({ error: "Invalid token" });
  }

  if (err.name === "TokenExpiredError") {
    return res.status(401).json({ error: "Token expired" });
  }

  // Validation errors (if you add validation later)
  if (err.name === "ValidationError") {
    return res.status(400).json({ error: err.message });
  }

  // Fallback for any other error
  return res.status(500).json({
    error: "An unexpected error occurred. Please try again later."
  });
}
