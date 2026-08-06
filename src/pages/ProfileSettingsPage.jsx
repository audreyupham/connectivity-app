import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";
import "./ProfileSettings.css";

export default function ProfileSettingsPage() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [newName, setNewName] = useState("");

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadProfile();
  }, []);

  async function loadProfile() {
    setError("");

    const res = await api.get("/auth/me");

    if (!res.ok) {
      setError(res.data?.error || "Unable to load profile");
      return;
    }

    setName(res.data.name);
    setEmail(res.data.email);
    setNewName(res.data.name);
  }

  async function handleNameUpdate(e) {
    e.preventDefault();

    setError("");
    setMessage("");

    const res = await api.put("/users", {
      name: newName,
    });

    if (!res.ok) {
      setError(res.data?.error || "Unable to update name");
      return;
    }

    setName(newName);
    setMessage("Profile updated successfully.");
  }

  function handleLogout() {
    localStorage.removeItem("accessToken");
    navigate("/login");
  }

  function handleResetPassword() {
    navigate("/reset-password");
  }

  return (
    <div className="profile-page">
      <div className="profile-card">

        <h1 className="profile-title">
          Profile Settings
        </h1>

        {error && <p className="error">{error}</p>}

        {message && <p className="success">{message}</p>}

        <div className="profile-info">
          <label>Email</label>

          <div className="profile-value">
            {email}
          </div>
        </div>

        <form
          onSubmit={handleNameUpdate}
          className="profile-form"
        >
          <label>Name</label>

          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            required
          />

          <button
            type="submit"
            className="profile-button"
          >
            Save Name
          </button>
        </form>

        <div className="profile-actions">

          <button
            onClick={handleResetPassword}
            className="profile-button secondary"
          >
            Reset Password
          </button>

          <button
            onClick={handleLogout}
            className="profile-button danger"
          >
            Log Out
          </button>

        </div>

      </div>
    </div>
  );
}