import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";
import "./FollowUpPage.css";

export default function FollowUpPage({ onFollowUpCompleted }) {
  const [followUps, setFollowUps] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function loadFollowUps() {
      setLoading(true);

      const res = await api.get("/contacts/followups");

      if (res.ok) {
        setFollowUps(res.data);
        window.dispatchEvent(new Event("followup-changed"));
      }

      setLoading(false);
    }

    loadFollowUps();
  }, []);

  async function markComplete(id) {
    const res = await api.put(`/contacts/followups/${id}/complete`);

    if (res.ok) {
      setFollowUps(prev => prev.filter(f => f.id !== id));

      // Notify sidebar
      window.dispatchEvent(new Event("followup-completed"));
    }
  }


  if (loading) {
    return (
      <div className="followup-page">
        <h1>Loading Follow-Ups...</h1>
      </div>
    );
  }

  return (
    <div className="followup-page">

      { <button className="back-button" onClick={() => navigate("/contacts")}>
        🠜
      </button>
      }

      <h1>Follow-Ups</h1>

      <p className="results-count">
        {followUps.length} follow-up{followUps.length !== 1 && "s"} pending
      </p>

      {followUps.length === 0 && (
        <div className="empty-results">
          No follow-ups pending.
        </div>
      )}

      {followUps.map(f => (
          <div key={f.id} className="followup-card">

            <div className="followup-main">
              <h2>{f.contact.name}</h2>
              <small>{new Date(f.createdAt).toLocaleString()}</small>
              <p>{f.text}</p>
            </div>

            <div className="followup-actions">
              <button
                className="complete-button"
                onClick={() => markComplete(f.id)}
              >
                Mark Complete
              </button>
            </div>

          </div>
      ))}

    </div>
  );
}