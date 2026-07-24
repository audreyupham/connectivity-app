import React from "react";
import ContactCard from "../components/ContactCard/ContactCard";
import SearchBar from "../components/SearchBar/SearchBar";
import "./ContactsPage.css";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function ContactsPage() {
    const navigate = useNavigate();

    const [contacts, setContacts] = useState([]);
    
    useEffect(() => {
    fetch("http://localhost:3001/contacts")
      .then(res => res.json())
      .then(data => setContacts(data));
    }, []);

    return (
        <>
        <SearchBar 
            contacts={contacts} 
            onSelectContact={(contact) => navigate(`/contacts/${contact.id}`)} 
            onCreateNewContact={(name) => navigate(`/create-new?name=${name}`)} />
        
        <div className="contacts-grid">
            {contacts.map(contact => (
                <Link 
                    key={contact.id}
                    to={`/contacts/${contact.id}`} 
                    className="card-link"
                >
                    <ContactCard contact={contact} />
                </Link>
            ))}
        </div>
        </>
    );
}
