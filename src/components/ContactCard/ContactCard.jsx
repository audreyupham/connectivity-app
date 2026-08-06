import React from "react";
import "./ContactCard.css";
import defaultAvatar from "../../assets/default-avatar.png";

export default function ContactCard({contact, generalNotes}) {
    return (
        <div className="contact-card">
            <img
                src={
                    contact.imageUrl
                        ? `http://localhost:3001${contact.imageUrl}`
                        : defaultAvatar
                }
                className="contact-card-avatar"
            />
            <div className="contact-info">
                <h3>{contact.name}</h3>
                <p className="contact-subtext">
                    {contact.generalNotes || "No additonal details yet."}
                </p>
            </div>
        </div>
    )
}