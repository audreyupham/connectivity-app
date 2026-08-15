import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";

export default function SignUpPage() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    const res = await api.post("/auth/register", {
      name,
      email,
      password,
    });

    if (!res.ok) {
      setError(res.data?.error || "Signup failed");
      return;
    }

    localStorage.setItem(
      "accessToken",
      res.data.accessToken
    );

    localStorage.setItem(
      "user",
      JSON.stringify(res.data.user)
    );

    navigate("/terms", { replace: true });
  }

  return (
    <form onSubmit={handleSubmit} className="login-form">
      {error && <p className="error">{error}</p>}

      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />

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
        Create Account
      </button>
    </form>
  );
}