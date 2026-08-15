import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import SearchBar from "../components/SearchBar/SearchBar";
import ContactDetailsLayout from "../components/ContactDetailsLayout/ContactDetailsLayout";
import api from "../utils/api";

export default function CreateNewPage() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const navigate = useNavigate();

  // Exact query param name: contactId
  const contactId = params.get("contactId");
  const nameParam = params.get("name");

  const [contacts, setContacts] = useState([]);
  const [mode, setMode] = useState("choose");
  const [selectedContact, setSelectedContact] = useState(null);

  const [draft, setDraft] = useState({
    name: "",
    generalNotes: "",
    newNote: "",
    image: null,        // Actual File object
    imagePreview: null // Local blob URL used only for preview
  });

  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);

  // Load contacts for SearchBar
  useEffect(() => {
    let mounted = true;

    async function load() {
      const { ok, data } = await api.get("/contacts");

      if (ok && mounted) {
        setContacts(data || []);
      }
    }

    load();

    return () => {
      mounted = false;
    };
  }, []);

  // Handle query parameters (contactId or name)
  useEffect(() => {
    let mounted = true;

    if (contactId) {
      (async () => {
        const {
          ok,
          data,
          status
        } = await api.get(
          `/contacts/${encodeURIComponent(contactId)}`
        );

        if (!ok) {
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
          newNote: "",
          image: null,
          imagePreview: null
        });

        setMode("add-note");
      })();
    } else if (nameParam) {
      setDraft({
        name: nameParam,
        generalNotes: "",
        newNote: "",
        image: null,
        imagePreview: null
      });

      setMode("create-contact");
    }

    return () => {
      mounted = false;
    };
  }, [location.search]);

  // Update draft fields
  function handleChange(field, value) {
    setDraft(prev => ({
      ...prev,
      [field]: value
    }));
  }

  async function handleSave() {
    if (isSaving) return;

    setIsSaving(true);
    setError(null);

    try {
      // ============================================================
      // ADD NOTE MODE
      // ============================================================
      if (mode === "add-note") {
        const targetId =
          selectedContact?.id || contactId;

        if (!targetId) {
          setError({
            message: "No contact selected to add a note to."
          });
          return;
        }

        const {
          ok,
          data,
          status
        } = await api.post(
          `/contacts/${encodeURIComponent(targetId)}/notes`,
          {
            text: draft.newNote
          }
        );

        if (!ok) {
          if (data && data.aborted) return;

          setError(
            data || {
              message: `Error ${status}`
            }
          );

          return;
        }

        navigate(`/contacts/${targetId}`);
        return;
      }

      // ============================================================
      // CREATE CONTACT MODE
      // ============================================================
      if (mode === "create-contact") {
        const {
          ok,
          data,
          status
        } = await api.post("/contacts", {
          name: draft.name,
          generalNotes: draft.generalNotes
        });

        if (!ok) {
          if (data && data.aborted) return;

          setError(
            data || {
              message: `Error ${status}`
            }
          );

          return;
        }

        const newContactId = data?.id;

        if (!newContactId) {
          setError({
            message:
              "Contact was created, but no contact ID was returned."
          });

          return;
        }

        if (draft.image) {
          const imageFormData = new FormData();

          imageFormData.append(
            "image",
            draft.image
          );

          const imageResult = await api.post(
            `/contacts/${encodeURIComponent(newContactId)}/image`,
            imageFormData
          );

          if (!imageResult.ok) {
            if (
              imageResult.data &&
              imageResult.data.aborted
            ) {
              return;
            }

            setError(
              imageResult.data || {
                message:
                  `Contact created, but image upload failed (${imageResult.status})`
              }
            );

            navigate(`/contacts/${newContactId}`);

            return;
          }
        }

        if (
          draft.newNote &&
          draft.newNote.trim() &&
          newContactId
        ) {
          const noteResult = await api.post(
            `/contacts/${encodeURIComponent(newContactId)}/notes`,
            {
              text: draft.newNote
            }
          );

          if (!noteResult.ok) {
            if (
              !(
                noteResult.data &&
                noteResult.data.aborted
              )
            ) {
              setError(
                noteResult.data || {
                  message:
                    `Note error ${noteResult.status}`
                }
              );
            }
          }
        }

        navigate(`/contacts/${newContactId}`);
        return;
      }
    } catch (err) {
      // Ignore native aborts
      if (
        err &&
        err.name === "AbortError"
      ) {
        return;
      }

      setError({
        message: err.message
      });
    } finally {
      setIsSaving(false);
    }
  }

  // ================================================================
  // ADD NOTE MODE
  // ================================================================
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

  // ================================================================
  // CREATE CONTACT MODE
  // ================================================================
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
        onImageUploaded={(updated) => {
         setDraft(prev => ({
            ...prev,
            image: updated.imageFile || prev.image,
            imagePreview:
              updated.imageUrl || prev.imagePreview
          }));
        }}
        onRemoveImage={() => {
          setDraft(prev => ({
            ...prev,
            image: null,
            imagePreview: null
          }));
        }}
        error={error}
      />
    );
  }

  // ================================================================
  // CHOOSE MODE
  // ================================================================
  return (
    <div>
      <SearchBar
        contacts={contacts}
        onSelectContact={(c) => {
          setSelectedContact(c);

          setDraft({
            name: c.name,
            generalNotes: c.generalNotes || "",
            newNote: "",
            image: null,
            imagePreview: null
          });

          setMode("add-note");
        }}
        onCreateNewContact={(name) => {
          setDraft({
            name,
            generalNotes: "",
            newNote: "",
            image: null,
            imagePreview: null
          });

          setMode("create-contact");
        }}
      />

      <h1 className="header">
        Select a Contact or Create a New One
      </h1>
    </div>
  );
}