import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../utils/api";

export default function ResetPasswordConfirmPage() {
  const navigate = useNavigate();
  const { token } = useParams();

  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    const res = await api.post("/auth/reset-password", {
      token,
      password,
    });

    if (!res.ok) {
      setError(res.data?.error || "Unable to reset password");
      return;
    }

    navigate("/login");
  }

  return (
    <form onSubmit={handleSubmit} className="login-form">
      {error && <p className="error">{error}</p>}

      <input
        type="password"
        placeholder="New Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />

      <button type="submit" className="login-button">
        Reset Password
      </button>
    </form>
  );
}