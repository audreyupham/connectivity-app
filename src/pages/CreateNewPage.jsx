import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import SearchBar from "../components/SearchBar/SearchBar";
import ContactDetailsLayout from "../components/ContactDetailsLayout/ContactDetailsLayout";

export default function CreateNewPage() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const navigate = useNavigate();
  
  const contactId = params.get("contactId");
  const nameParam = params.get("name");

  const [contacts, setContacts] = useState([]);

  const [mode, setMode] = useState("choose");
  const [selectedContact, setSelectedContact] = useState(null);
  const [draft, setDraft] = useState({
    name: "",
    generalNotes: "",
    newNote: ""
  });

  useEffect(() => {
    fetch("http://localhost:3001/contacts")
      .then(res => res.json())
      .then(data => setContacts(data));
  }, []);


  // Handle query parameters (contactId or name)
  useEffect(() => {
    if (contactId) {
      fetch(`http://localhost:3001/contacts/${contactId}`)
        .then(res => res.json())
        .then(contact => {
          setSelectedContact(contact);
          setDraft({
            name: contact.name,
            generalNotes: contact.generalNotes,
            newNote: ""
          });
          setMode("add-note");
        });
    } else if (nameParam) {
      setDraft({ name: nameParam, generalNotes: "", newNote: "" });
      setMode("create-contact");
    }
  }, [location.search]);

  // Update draft fields
  function handleChange(field, value) {
    setDraft(prev => ({ ...prev, [field]: value }));
  }

  async function handleSave() {
    console.log("HANDLE SAVE FIRED", mode, draft);

    try {
      if (mode === "add-note") {
        const res = await fetch(`http://localhost:3001/contacts/${contactId}/notes`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: draft.newNote }),
        });

        console.log("NOTE RESPONSE", res.status);

        const data = await res.json();
        console.log("NOTE DATA", data);

        navigate(`/contacts/${contactId}`);
        return;
      }

      if (mode === "create-contact") {
        const res = await fetch("http://localhost:3001/contacts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: draft.name,
            generalNotes: draft.generalNotes,
          }),
        });

        console.log("CREATE RESPONSE", res.status);

        const newContact = await res.json();
        console.log("NEW CONTACT", newContact);

        navigate(`/contacts/${newContact.id}`);
      }
    } catch (err) {
      console.error("SAVE ERROR", err);
    }
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
        onEdit={() => {}}
        onAddNote={() => {}}
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
        onEdit={() => {}}
        onAddNote={() => {}}
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
