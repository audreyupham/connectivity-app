import { useState } from "react";
import api from "../utils/api";

export default function ResetPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();

    setError("");
    setMessage("");
    setLoading(true);

    console.log("Password reset form submitted");

    try {
      const res = await api.post("/auth/reset-request", {
        email,
      });

      console.log("Password reset API response:", res);

      if (!res.ok) {
        setError(
          res.data?.error ||
          res.data?.message ||
          "Unable to start reset"
        );
        return;
      }

      setMessage(
        "Check your email for a password reset link."
      );
    } catch (err) {
      console.error("Password reset request failed:", err);

      setError(
        "Unable to connect to the server. Please try again."
      );
    } finally {
      setLoading(false);
    }
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
        disabled={loading}
      />

      <button
        type="submit"
        className="login-button"
        disabled={loading}
      >
        {loading ? "Sending..." : "Send Reset Link"}
      </button>
    </form>
  );
}