import { useState, useRef, useEffect } from "react";
import "./SearchBar.css";

export default function SearchBar({ contacts, onSelectContact, onCreateNewContact }) {
  const [value, setValue] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef(null);

  // Filter contacts based on the search input
  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(value.trim().toLowerCase())
  );

  const shouldShowCreateNew = true;

  // Close when clicking outside
  useEffect(() => {
    function handleDocClick(e) {
      if (!wrapperRef.current) return;
      if (!wrapperRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleDocClick);
    return () => document.removeEventListener("mousedown", handleDocClick);
  }, []);

  // keyboard: close on Escape
  function handleKeyDown(e) {
    if (e.key === "Escape") {
      setIsOpen(false);
    }
  }

  return (
    <div className="searchbar-container" ref={wrapperRef}>
      <input
        type="text"
        className="search-input"
        placeholder="Search contacts..."
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onFocus={() => setIsOpen(true)}
        onBlur={() => {
          // keep a tiny delay so clicks on suggestions register first
          setTimeout(() => setIsOpen(false), 150);
        }}
        onKeyDown={handleKeyDown}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      />

      {/* suggestions are absolutely positioned so they overlay the page */}
      <div className={`suggestions ${isOpen ? "" : "hidden"}`} role="listbox">
        {filteredContacts.map(contact => (
          <div
            key={contact.id}
            className="suggestion-item"
            // use onMouseDown to avoid input blur before click handler runs
            onMouseDown={(e) => { e.preventDefault(); onSelectContact(contact); setIsOpen(false); }}
            tabIndex={0}
            role="option"
          >
            {contact.name}
          </div>
        ))}

        {shouldShowCreateNew && (
          <div
            className="suggestion-create-new"
            onMouseDown={(e) => { e.preventDefault(); onCreateNewContact(value); setIsOpen(false); }}
            tabIndex={0}
            role="option"
          >
            <span className="plus">+</span>
            Create new contact: "{value}"
          </div>
        )}
      </div>
    </div>
  );
}
