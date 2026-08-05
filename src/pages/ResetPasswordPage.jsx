import { useState } from "react";
import api from "../utils/api";

export default function ResetPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();

    setError("");
    setMessage("");

    const res = await api.post("/auth/reset-request", {
      email,
    });

    if (!res.ok) {
      setError(
        res.data?.error ||
        "Unable to start reset"
      );
      return;
    }

    setMessage(
      "Check your email for a password reset link."
    );
  }

  return (
    <form onSubmit={handleSubmit} className="login-form">

      {error && <p className="error">{error}</p>}

      {message && (
        <p className="success">{message}</p>
      )}

      <input
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />

      <button type="submit" className="login-button">
        Send Reset Link
      </button>

    </form>
  );
}