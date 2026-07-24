import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ContactDetailsLayout from "../components/ContactDetailsLayout/ContactDetailsLayout";

export default function ExpandedContactPage() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [contact, setContact] = useState(null);
  const [draft, setDraft] = useState({
    name: "",
    generalNotes: ""
  });
  const [mode, setMode] = useState("view");

  //fetch contact from backend
  useEffect(() => {
    fetch(`http://localhost:3001/contacts/${id}`)
      .then(res => res.json())
      .then(data => {
        setContact(data)
        setDraft({
          name: data.name,
          generalNotes: data.generalNotes
        })
      });
  }, [id]);

  if (!contact) return <div>Loading...</div>;



  function handleChange(field, value) {
    setDraft(prev => ({ ...prev, [field]: value }));
  }

  async function handleSave() {
    const res = await fetch(`http://localhost:3001/contacts/${contact.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(draft),
    });

    const updated = await res.json();
    setContact(updated);
    setMode("view");
  }

  console.log("EXPANDED SAVE FIRED", mode, draft);

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
