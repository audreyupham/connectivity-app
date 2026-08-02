import { useState } from "react";
import "./SearchBar.css";

export default function SearchBar({ contacts, onSelectContact, onCreateNewContact }) {
  const [value, setValue] = useState("");
  const [hideSuggestions, setHideSuggestions] = useState(true);

  // Filter contacts based on the search input
  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(value.trim().toLowerCase())
  );

  const shouldShowCreateNew = true;


  return (
    <div className="searchbar-container">
      <input
        type="text"
        className="search-input"
        placeholder="Search contacts..."
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onFocus={() => setHideSuggestions(false)}
        onBlur={() => setTimeout(() => setHideSuggestions(true), 200)}
      />

      <div
        className={`suggestions ${hideSuggestions ? "hidden" : ""}`}
      >
        {filteredContacts.map(contact => (
          <div
            key={contact.id}
            className="suggestion-item"
            onClick={() => onSelectContact(contact)}
          >
            {contact.name}
          </div>
        ))}

        {shouldShowCreateNew && (
          <div
              className="suggestion-create-new"
              onClick={() => onCreateNewContact(value)}
          >
              Create new contact: "{value}"
          </div>
        )}
      </div>
    </div>
  );
}
