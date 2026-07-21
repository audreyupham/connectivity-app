import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ContactDetailsLayout from "../components/ContactDetailsLayout/ContactDetailsLayout";

export default function ExpandedContactPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  // TODO: replace with real database later
  const contacts = [
    { id: 1, name: "John Doe", generalNotes: "", timestampedNotes: [] },
    { id: 2, name: "Jane Smith", generalNotes: "", timestampedNotes: [] },
    { id: 3, name: "Michael Johnson", generalNotes: "", timestampedNotes: [] },
    { id: 4, name: "Emily Davis", generalNotes: "", timestampedNotes: [] },
    { id: 5, name: "Chris Brown", generalNotes: "", timestampedNotes: [] },
    { id: 6, name: "Sarah Wilson", generalNotes: "", timestampedNotes: [] }
  ];

  const contact = contacts.find(c => c.id === Number(id));

  const [mode, setMode] = useState("view");
  const [draft, setDraft] = useState(contact);

  function handleChange(field, value) {
    setDraft(prev => ({ ...prev, [field]: value }));
  }

  function handleSave() {
    console.log("Saving updated contact:", draft);
    setMode("view");
  }

  return (
    <ContactDetailsLayout
      contact={contact}
      contactDraft={draft}
      mode={mode}
      onChange={handleChange}
      onSave={handleSave}
      onEdit={() => setMode("edit")}
      onAddNote={() => navigate(`/create-new?contactId=${id}`)}
    />
  );
}
