import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import SearchBar from "../components/SearchBar/SearchBar";
import ContactDetailsLayout from "../components/ContactDetailsLayout/ContactDetailsLayout";

export default function CreateNewPage() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);

  const contactId = params.get("contactId");
  const nameParam = params.get("name");

  const [mode, setMode] = useState("choose");
  const [selectedContact, setSelectedContact] = useState(null);
  const [draft, setDraft] = useState({
    name: "",
    generalNotes: "",
    newNote: ""
  });

  // TODO: replace with real database later
  const contacts = [
    { id: 1, name: "John Doe", generalNotes: "", timestampedNotes: [] },
    { id: 2, name: "Jane Smith", generalNotes: "", timestampedNotes: [] },
    { id: 3, name: "Michael Johnson", generalNotes: "", timestampedNotes: [] },
    { id: 4, name: "Emily Davis", generalNotes: "", timestampedNotes: [] },
    { id: 5, name: "Chris Brown", generalNotes: "", timestampedNotes: [] },
    { id: 6, name: "Sarah Wilson", generalNotes: "", timestampedNotes: [] }
  ];

  // Handle query parameters (contactId or name)
  useEffect(() => {
    if (contactId) {
      const contact = contacts.find(c => c.id === Number(contactId));
      setSelectedContact(contact);
      setDraft({ name: contact.name, generalNotes: contact.generalNotes, newNote: "" });
      setMode("add-note");
    } else if (nameParam) {
      setDraft({ name: nameParam, generalNotes: "", newNote: "" });
      setMode("create-contact");
    }
  }, [contactId, nameParam]);

  // Update draft fields
  function handleChange(field, value) {
    setDraft(prev => ({ ...prev, [field]: value }));
  }

  // Placeholder save logic
  function handleSave() {
    console.log("Saving draft:", draft);
  }

  // ADD-NOTE MODE
  if (mode === "add-note") {
    return (
      <ContactDetailsLayout
        contact={selectedContact}
        contactDraft={draft}
        mode="add-note"
        onSave={handleSave}
        onChange={handleChange}
      />
    );
  }

  // CREATE-CONTACT MODE
  if (mode === "create-contact") {
    return (
      <ContactDetailsLayout
        contact={null}
        contactDraft={draft}
        mode="create"
        onSave={handleSave}
        onChange={handleChange}
      />
    );
  }

  // CHOOSE MODE (SearchBar only)
  return (
    <SearchBar
      contacts={contacts}
      onSelectContact={(c) => {
        setSelectedContact(c);
        setDraft({ name: c.name, generalNotes: c.generalNotes, newNote: "" });
        setMode("add-note");
      }}
      onCreateNewContact={(name) => {
        setDraft({ name, generalNotes: "", newNote: "" });
        setMode("create-contact");
      }}
    />
  );
}
