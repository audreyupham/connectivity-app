import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ContactDetailsLayout from "../components/ContactDetailsLayout/ContactDetailsLayout";
import api from "../utils/api";

// fetch contact, edit contact, add/edit/delete notes
export default function ExpandedContactPage() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [contact, setContact] = useState(null);
  const [draft, setDraft] = useState({
    name: "",
    generalNotes: "",
    newNote: "",
    editingNoteId: null
  });
  const [mode, setMode] = useState("view"); // view, edit, add-note, edit-note, create
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);

  // Fetch contact on load, cancel on unmount or id change
  useEffect(() => {
    const ac = new AbortController();
    setError(null);

    async function load() {
      try {
        const { ok, data, status } = await api.get(`/contacts/${id}`, { signal: ac.signal });

        // ignore aborted requests (navigation/unmount)
        if (!ok) {
          if (data && data.aborted) return;
          setError(data || { message: `Error ${status}` });
          return;
        }

        setContact(data);
        setDraft({
          name: data.name || "",
          generalNotes: data.generalNotes || "",
          newNote: "",
          editingNoteId: null
        });
      } catch (err) {
        // still ignore native AbortError thrown by fetch
        if (err && err.name === "AbortError") return;
        setError({ message: err.message });
      }
    }


    load();
    return () => ac.abort();
  }, [id]);

  if (!contact) return <div>Loading...</div>;

  // Update draft fields
  function handleChange(field, value) {
    setDraft(prev => ({ ...prev, [field]: value }));
  }

  // Save handler (mode-aware)
  async function handleSave() {
    if (isSaving) return;
    setError(null);
    setIsSaving(true);

    // EDIT NOTE MODE
    if (mode === "edit-note") {
      try {
        const { ok, data, status } = await api.put(
          `/contacts/${contact.id}/notes/${draft.editingNoteId}`,
          { text: draft.newNote }
        );

        if (!ok) {
          setError(data || { message: `Error ${status}` });
          return;
        }

        // backend returns full updated contact
        setContact(data);
        setDraft(prev => ({ ...prev, newNote: "", editingNoteId: null }));
        setMode("view");
        return;
      } catch (err) {
        setError({ message: err.message });
        return;
      } finally {
        setIsSaving(false);
      }
    }

    // ADD NOTE MODE
    if (mode === "add-note") {
      try {
        const { ok, data, status } = await api.post(`/contacts/${contact.id}/notes`, { text: draft.newNote });
        if (!ok) {
          setError(data || { message: `Error ${status}` });
          return;
        }

        // safe update: handle missing timestampedNotes
        setContact(prev => ({
          ...prev,
          timestampedNotes: [...(prev.timestampedNotes || []), data]
        }));

        setDraft(prev => ({ ...prev, newNote: "" }));
        setMode("view");
        return;
      } catch (err) {
        setError({ message: err.message });
        return;
      } finally {
        setIsSaving(false);
      }
    }

    // EDIT CONTACT MODE
    if (mode === "edit") {
      try {
        const { ok, data, status } = await api.put(`/contacts/${contact.id}`, {
          name: draft.name,
          generalNotes: draft.generalNotes
        });

        if (!ok) {
          setError(data || { message: `Error ${status}` });
          return;
        }

        setContact(data);
        setMode("view");
        return;
      } catch (err) {
        setError({ message: err.message });
        return;
      } finally {
        setIsSaving(false);
      }
    }

    setIsSaving(false);
  }

  // Delete note
  async function handleDeleteNote(noteId) {
    if (isSaving) return;
    setError(null);
    setIsSaving(true);

    try {
      const { ok, status, data } = await api.del(`/contacts/${contact.id}/notes/${noteId}`);
      if (!ok) {
        setError(data || { message: `Error ${status}` });
        return;
      }

      // remove note from state
      setContact(prev => ({
        ...prev,
        timestampedNotes: (prev.timestampedNotes || []).filter(n => n.id !== noteId)
      }));
    } catch (err) {
      setError({ message: err.message });
    } finally {
      setIsSaving(false);
    }
  }

  // edit-note mode: populate draft with note text
  function handleEditNote(note) {
    setDraft({
      name: contact.name || "",
      generalNotes: contact.generalNotes || "",
      newNote: note.text,
      editingNoteId: note.id
    });
    setMode("edit-note");
  }

  // Cancel (mode-aware)
  function handleCancel() {
    setDraft({
      name: contact.name || "",
      generalNotes: contact.generalNotes || "",
      newNote: "",
      editingNoteId: null
    });
    setMode("view");
    setError(null);
  }

  async function handleDeleteContact(id) {
    if (!id) return;
    if (!window.confirm("Delete this contact? This cannot be undone.")) return;
    if (isSaving) return;
    setIsSaving(true);
    setError(null);

    try {
      const { ok, status, data } = await api.del(`/contacts/${encodeURIComponent(id)}`);
      if (!ok) {
        if (data && data.aborted) return;
        setError(data || { message: `Error ${status}` });
        return;
      }
      // success: go back to contacts list
      navigate("/contacts");
    } catch (err) {
      if (err && err.name === "AbortError") return;
      setError({ message: err.message });
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <ContactDetailsLayout
      contact={contact}
      contactDraft={draft}
      mode={mode}
      onChange={handleChange}
      onSave={handleSave}
      onEdit={() => setMode("edit")}
      onAddNote={() => setMode("add-note")}
      onBack={() => navigate("/contacts")}
      onCancel={handleCancel}
      onEditNote={handleEditNote}
      onDeleteNote={handleDeleteNote}
      onDeleteContact={handleDeleteContact}
      isSaving={isSaving}
      error={error}
    />
  );
}