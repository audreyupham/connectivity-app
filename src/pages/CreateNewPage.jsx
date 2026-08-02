import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import SearchBar from "../components/SearchBar/SearchBar";
import ContactDetailsLayout from "../components/ContactDetailsLayout/ContactDetailsLayout";
import api from "../utils/api";

export default function CreateNewPage() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const navigate = useNavigate();

  // exact query param name: contactId
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
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    async function load() {
      const { ok, data } = await api.get("/contacts");
      if (ok && mounted) setContacts(data || []);
    }
    load();
    return () => { mounted = false; };
  }, []);

  // Handle query parameters (contactId or name)
  useEffect(() => {
    let mounted = true;
    if (contactId) {
      (async () => {
        const { ok, data, status } = await api.get(`/contacts/${encodeURIComponent(contactId)}`);
        if (!ok) {
          // ignore aborts if api marks them
          if (data && data.aborted) return;
          if (!mounted) return;
          setError(data || { message: `Error ${status}` });
          return;
        }
        if (!mounted) return;
        setSelectedContact(data);
        setDraft({
          name: data.name || "",
          generalNotes: data.generalNotes || "",
          newNote: ""
        });
        setMode("add-note");
      })();
    } else if (nameParam) {
      setDraft({ name: nameParam, generalNotes: "", newNote: "" });
      setMode("create-contact");
    }
    return () => { mounted = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.search]);

  // Update draft fields
  function handleChange(field, value) {
    setDraft(prev => ({ ...prev, [field]: value }));
  }

  async function handleSave() {
    if (isSaving) return;
    setIsSaving(true);
    setError(null);

    try {
      // ADD-NOTE MODE
      if (mode === "add-note") {
        // prefer selectedContact.id, fall back to contactId query param
        const targetId = selectedContact?.id || contactId;
        if (!targetId) {
          setError({ message: "No contact selected to add a note to." });
          return;
        }

        const { ok, data, status } = await api.post(`/contacts/${encodeURIComponent(targetId)}/notes`, { text: draft.newNote });
        if (!ok) {
          if (data && data.aborted) return;
          setError(data || { message: `Error ${status}` });
          return;
        }

        navigate(`/contacts/${targetId}`);
        return;
      }

      // CREATE-CONTACT MODE
      if (mode === "create-contact") {
        const { ok, data, status } = await api.post("/contacts", {
          name: draft.name,
          generalNotes: draft.generalNotes
        });

        if (!ok) {
          if (data && data.aborted) return;
          setError(data || { message: `Error ${status}` });
          return;
        }

        // if user entered a newNote while creating, add it to the newly created contact
        const newContactId = data?.id;
        if (draft.newNote && newContactId) {
          const noteResult = await api.post(`/contacts/${encodeURIComponent(newContactId)}/notes`, { text: draft.newNote });
          if (!noteResult.ok) {
            // ignore aborts, otherwise surface error but still navigate to contact
            if (!(noteResult.data && noteResult.data.aborted)) {
              setError(noteResult.data || { message: `Note error ${noteResult.status}` });
            }
          }
        }

        navigate(`/contacts/${newContactId}`);
        return;
      }
    } catch (err) {
      // ignore native aborts thrown by fetch
      if (err && err.name === "AbortError") return;
      setError({ message: err.message });
    } finally {
      setIsSaving(false);
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
        onBack={() => navigate("/contacts")}
        onCancel={() => navigate("/contacts")}
        isSaving={isSaving}
        error={error}
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
        onBack={() => navigate("/contacts")}
        onCancel={() => navigate("/contacts")}
        isSaving={isSaving}
        error={error}
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