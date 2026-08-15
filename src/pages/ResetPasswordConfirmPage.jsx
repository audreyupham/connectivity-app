import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../utils/api";

export default function ResetPasswordConfirmPage() {
  const navigate = useNavigate();
  const { token } = useParams();

  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();

    setError("");
    setMessage("");
    setLoading(true);

    console.log("Password reset confirmation submitted");

    try {
      const res = await api.post("/auth/reset-password", {
        token,
        password,
      });

      console.log("Password reset confirmation response:", res);

      if (!res.ok) {
        setError(
          res.data?.error ||
          res.data?.message ||
          "Unable to reset password"
        );
        return;
      }

      setMessage("Password updated successfully.");

      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (err) {
      console.error("Password reset confirmation failed:", err);

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
        type="password"
        placeholder="New Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        disabled={loading}
      />

      <button
        type="submit"
        className="login-button"
        disabled={loading}
      >
        {loading ? "Resetting..." : "Reset Password"}
      </button>
    </form>
  );
}