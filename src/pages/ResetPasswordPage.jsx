import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";

export default function ResetPasswordPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    const res = await api.post("/auth/reset-request", { email });

    if (!res.ok) {
      setError(res.data?.error || "Unable to start reset");
      return;
    }

    navigate(`/reset-password/${res.data.token}`);
  }

  return (
    <form onSubmit={handleSubmit} className="login-form">
      {error && <p className="error">{error}</p>}

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