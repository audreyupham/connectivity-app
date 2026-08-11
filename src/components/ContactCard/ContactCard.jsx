import React from "react";
import "./ContactCard.css";
import defaultAvatar from "../../assets/default-avatar.png";

export default function ContactCard({ contact }) {
  return (
    <div className="contact-card">
      <img
        src={contact.imageUrl || defaultAvatar}
        alt={`${contact.name}'s profile picture`}
        className="contact-card-avatar"
      />

      <div className="contact-info">
        <h3>{contact.name}</h3>

        <p>
          {contact.generalNotes || "No additional details yet."}
        </p>
      </div>
    </div>
  );
}