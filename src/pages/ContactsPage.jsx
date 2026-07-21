import React from "react";
import ContactCard from "../components/ContactCard/ContactCard";
import SearchBar from "../components/SearchBar/SearchBar";
import "./ContactsPage.css";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

export default function ContactsPage() {
    const navigate = useNavigate();

    const contacts = [
        { id: 1, name: "John Doe", avatarUrl: "/default-avatar.png" },
        { id: 2, name: "Jane Smith", avatarUrl: "/default-avatar.png" },
        { id: 3, name: "Michael Johnson", avatarUrl: "/default-avatar.png" },
        { id: 4, name: "Emily Davis", avatarUrl: "/default-avatar.png" },
        { id: 5, name: "Chris Brown", avatarUrl: "/default-avatar.png" },
        { id: 6, name: "Sarah Wilson", avatarUrl: "/default-avatar.png" }
    ];

    return (
        <>
        <SearchBar 
            contacts={contacts} 
            onSelectContact={(contact) => navigate(`/contacts/${contact.id}`)} 
            onCreateNewContact={(name) => navigate(`/create-new?name=${name}`)} />
        
        <div className="contacts-grid">
            {contacts.map(contact => (
                <Link to={`/contacts/${contact.id}`} className="card-link">
                    <ContactCard contact={contact} />
                </Link>
            ))}
        </div>
        </>
    );
}
