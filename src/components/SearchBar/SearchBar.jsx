import { useState, useRef, useEffect } from "react";
import "./SearchBar.css";
import { useNavigate } from "react-router-dom";

export default function SearchBar({ 
  contacts, 
  onSelectContact, 
  onCreateNewContact, 
  searchMode = "people" 
}) {
  const [value, setValue] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef(null);

  const navigate = useNavigate();

  // Filter contacts based on the search input
  const searchValue = value.trim().toLowerCase();
  
  function handleKeyDown(e) {
    if (e.key === "Escape") {
      setIsOpen(false);
    }

    if (
      e.key === "Enter" &&
      searchMode === "information" &&
      value.trim()
    ) {
      navigate(
        `/search?q=${encodeURIComponent(value.trim())}`
      );
    }
  }
  
  
  const filteredContacts = contacts.filter(contact => {
    if (!searchValue) return true;

    if (searchMode === "people") {
      return contact.name
        .toLowerCase()
        .includes(searchValue);
    }

    if (searchMode === "information") {

      const nameMatch =
        contact.name?.toLowerCase().includes(searchValue);

      const generalNotesMatch =
        contact.generalNotes?.toLowerCase().includes(searchValue);

      const notesMatch =
        contact.timestampedNotes?.some(note =>
          note.text.toLowerCase().includes(searchValue)
        );

      return (
        nameMatch ||
        generalNotesMatch ||
        notesMatch
      );
    }

    return false;
  });

  const shouldShowCreateNew =
    searchMode === "people";

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

  function handleSearchSubmit(e) {
    if (e.key === "Enter") {
      e.preventDefault();

      if (searchMode === "information" && value.trim()) {
        navigate(`/search?q=${encodeURIComponent(value.trim())}`);
        setIsOpen(false);
      }
    }
  }

  return (
    <div className="searchbar-container" ref={wrapperRef}>
      { searchMode === "people" ? (
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
          onKeyDown={(e) => {
            handleKeyDown(e);
            handleSearchSubmit(e);
          }}
          aria-expanded={isOpen}
          aria-haspopup="listbox"
        />
      ) : (
        <input
        type="text"
        className="search-input"
        placeholder="Search contacts and notes..."
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onFocus={() => setIsOpen(true)}
        onBlur={() => {
          // keep a tiny delay so clicks on suggestions register first
          setTimeout(() => setIsOpen(false), 150);
        }}
        onKeyDown={(e) => {
          handleKeyDown(e);
          handleSearchSubmit(e);
        }}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      />
      )}

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