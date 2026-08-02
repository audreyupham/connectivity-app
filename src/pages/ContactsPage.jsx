import React, { useEffect, useState } from "react";
import ContactCard from "../components/ContactCard/ContactCard";
import SearchBar from "../components/SearchBar/SearchBar";
import "./ContactsPage.css";
import { Link, useNavigate } from "react-router-dom";
import api from "../utils/api";

export default function ContactsPage() {
  const navigate = useNavigate();
  const [contacts, setContacts] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    async function load() {
      const { ok, data, status } = await api.get("/contacts");
      if (!ok) {
        setError(data || { message: `Error ${status}` });
        return;
      }
      if (mounted) setContacts(data || []);
    }
    load();
    return () => { mounted = false; };
  }, []);

  return (
    <>
      <SearchBar
        contacts={contacts}
        onSelectContact={(contact) => navigate(`/contacts/${contact.id}`)}
        onCreateNewContact={(name) => navigate(`/create-new?name=${encodeURIComponent(name)}`)}
      />
      {error && <div className="error">{error.message || "Error loading contacts"}</div>}
      <div className="contacts-grid">
        {contacts.map(contact => (
          <Link key={contact.id} to={`/contacts/${contact.id}`} className="card-link">
            <ContactCard contact={contact} />
          </Link>
        ))}
      </div>
    </>
  );
}