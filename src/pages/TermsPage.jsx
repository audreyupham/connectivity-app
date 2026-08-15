import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";

export default function TermsPage() {
  const navigate = useNavigate();

  const [isAccepting, setIsAccepting] = useState(false);
  const [error, setError] = useState("");

  async function handleAccept() {
    if (isAccepting) return;

    setIsAccepting(true);
    setError("");

    const res = await api.post("/auth/accept-terms");

    if (!res.ok) {
      setError(
        res.data?.error ||
        "Unable to accept the terms."
      );
      setIsAccepting(false);
      return;
    }

    const user = JSON.parse(
      localStorage.getItem("user") || "{}"
    );

    localStorage.setItem(
      "user",
      JSON.stringify({
        ...user,
        termsAccepted: true
      })
    );

    navigate("/contacts", { replace: true });
  }

  return (
    <div className="terms-page">

      <h1>Terms and Conditions</h1>

      <div className="terms-content">
        {/* Put your actual terms here */}

        <h2>Terms of Use</h2>

        <p>
          Your actual Terms and Conditions go here.
        </p>

      </div>

      {error && (
        <p className="error">
          {error}
        </p>
      )}

      <button
        onClick={handleAccept}
        disabled={isAccepting}
      >
        {isAccepting
          ? "Accepting..."
          : "I Accept"}
      </button>
    </div>
  );
}