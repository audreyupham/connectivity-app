import React from "react";
import "./ContactCard.css";

export default function ContactCard({contact}) {
    return (
        <div className="contact-card">
            <img 
                src={contact.avatarUrl || "/default-avatar.png"} 
                alt={contact.name} 
                className="avatar"
            />
            <div className="contact-info">
                <h3>{contact.name}</h3>
                <p className="contact-subtext">
                    Additional details go here...
                </p>
            </div>
        </div>
    )
}