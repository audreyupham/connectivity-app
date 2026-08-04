import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    const res = await api.post("/auth/login", { email, password });

    if (!res.ok) {
      setError(res.data?.error || "Login failed");
      return;
    }

    localStorage.setItem("accessToken", res.data.accessToken);
    navigate("/contacts");
  }

  return (
  <form onSubmit={handleSubmit} className="login-form">
    {error && <p className="error">{error}</p>}

    <input
      type="email"
      placeholder="Email"
      value={email}
      onChange={(e) => setEmail(e.target.value)}
      required
    />

    <input
      type="password"
      placeholder="Password"
      value={password}
      onChange={(e) => setPassword(e.target.value)}
      required
    />

    <button type="submit" className="login-button">
      Login
    </button>
  </form>
  );
  
}