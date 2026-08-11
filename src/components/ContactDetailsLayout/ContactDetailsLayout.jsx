import "./ContactDetailsLayout.css";
import ExpandedContactHeader from "../ExpandedContactHeader";
import Label from "../Label";
import TextField from "../TextField";
import TextAreaField from "../TextAreaField";
import TimestampedNotesList from "../TimestampedNotesList";

export default function ContactDetailsLayout({
  contact,
  contactDraft,
  mode,
  onChange,
  onSave,
  onEdit,
  onAddNote,
  onBack,
  onCancel,
  onEditNote,
  onDeleteNote,
  onDeleteContact,
  onImageUploaded,
  onRemoveImage,
  isSaving = false,
  error = null
}) {

  // Save timestamped note.
  // If the note is empty, simply cancel instead.
  function handleNoteSave() {
    const noteText = contactDraft.newNote?.trim();

    if (!noteText) {
      onCancel();
      return;
    }

    onSave();
  }

  function ActionToolbar() {
    return (
      <div className="contact-toolbar">

        {/* Edit button */}
        {mode === "view" && (
          <button onClick={onEdit}>
            Edit
          </button>
        )}

        {/* Save button for contact editing/creation only */}
        {(mode === "edit" || mode === "create") && (
          <button
            onClick={onSave}
            disabled={isSaving}
          >
            Save
          </button>
        )}

        {/* Delete contact */}
        {mode !== "create" &&
          mode !== "edit-note" &&
          mode !== "add-note" && (
            <button
              className="delete"
              onClick={() =>
                onDeleteContact &&
                onDeleteContact(contact?.id)
              }
              disabled={isSaving}
            >
              Delete
            </button>
          )}
      </div>
    );
  }

  const isNoteMode =
    mode === "add-note" ||
    mode === "edit-note";

  const isLockedContactInfo =
    mode === "view" ||
    mode === "add-note" ||
    mode === "edit-note";

  return (
    <div className="contact-details-layout">

      {/* ---------- Back Button ---------- */}

      <div className="floating-back-button">

        {mode === "view" && (
          <button onClick={onBack}>
            ⇦
          </button>
        )}

        {(mode === "edit" ||
          mode === "add-note" ||
          mode === "edit-note" ||
          mode === "create") && (
          <button
            onClick={onCancel}
            disabled={isSaving}
          >
            ⇦
          </button>
        )}

      </div>

      {/* ---------- Top Toolbar ---------- */}

      <ActionToolbar />

      {/* ---------- Error ---------- */}

      {error && (
        <div className="error">
          {error.message || "Error"}
        </div>
      )}

      {/* ---------- Contact Header ---------- */}

      {contact && (
        <ExpandedContactHeader
          contact={contact}
          mode={mode}
          onImageUploaded={onImageUploaded}
          onRemoveImage={onRemoveImage}
        />
      )}

      {/* ---------- CREATE MODE ---------- */}

      {mode === "create" && (
        <>
          <TextField
            label="Name"
            value={contactDraft.name}
            onChange={(val) =>
              onChange("name", val)
            }
          />

          <TextAreaField
            label="General Notes"
            value={contactDraft.generalNotes}
            onChange={(val) =>
              onChange("generalNotes", val)
            }
          />
        </>
      )}

      {/* ---------- EXISTING CONTACT ---------- */}

      {mode !== "create" && (
        <>

          {/* ---------- Name ---------- */}

          {!isLockedContactInfo && (
            <TextField
              label="Name"
              value={contactDraft.name}
              onChange={(val) =>
                onChange("name", val)
              }
            />
          )}

          {/* ---------- General Notes ---------- */}

          {isLockedContactInfo ? (
            <Label
              label="General Notes"
              value={
                contact?.generalNotes ||
                "No notes yet."
              }
            />
          ) : (
            <TextAreaField
              label="General Notes"
              value={contactDraft.generalNotes}
              onChange={(val) =>
                onChange("generalNotes", val)
              }
            />
          )}

          {/* ---------- Timestamped Note Editor ---------- */}

          {isNoteMode && (
            <div className="note-editor">

              <TextAreaField
                label={
                  mode === "add-note"
                    ? "New Note"
                    : "Edit Note"
                }
                value={contactDraft.newNote}
                onChange={(val) =>
                  onChange("newNote", val)
                }
              />

              <div className="note-editor-actions">

                {/* Cancel */}
                <button
                  type="button"
                  className="note-cancel-button"
                  onClick={onCancel}
                  disabled={isSaving}
                >
                  Cancel
                </button>

                {/* Save */}
                <button
                  type="button"
                  className="note-save-button"
                  onClick={handleNoteSave}
                  disabled={isSaving}
                >
                  {isSaving
                    ? "Saving..."
                    : mode === "add-note"
                      ? "Save Note"
                      : "Save Changes"}
                </button>

              </div>
            </div>
          )}

          {/* ---------- Notes ---------- */}

          <h3>Notes</h3>

          <TimestampedNotesList
            notes={contact?.timestampedNotes || []}
            onEditNote={onEditNote}
            onDeleteNote={onDeleteNote}
            readOnly={
              mode === "edit" ||
              mode === "edit-note"
            }
            className="timestamped-notes-list"
          />

          {/* ---------- Add Note Button ---------- */}

          {mode === "view" && (
            <button
              className="floating-add-button"
              onClick={onAddNote}
              disabled={isSaving}
            >
              <strong>+</strong>
            </button>
          )}

        </>
      )}

    </div>
  );
}