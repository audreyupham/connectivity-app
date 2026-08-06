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

  function ActionToolbar() {
    return (
      <div className="contact-toolbar">
        <div className="toolbar-left">

          {mode === "view" && (
            <button onClick={onBack}>
              Back
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
              Cancel
            </button>
          )}
        </div>

        <div className="toolbar-right">
          {mode === "view" && (
            <button onClick={onEdit}>
              Edit
            </button>
          )}

          {(mode === "edit" ||
            mode === "add-note" ||
            mode === "edit-note" ||
            mode === "create") && (
            <button
              onClick={onSave}
              disabled={isSaving}
            >
              Save
            </button>
          )}

          {mode !== "create" && (
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

      <ActionToolbar />

      {error && (
        <div className="error">
          {error.message || "Error"}
        </div>
      )}

      {contact && (
        <ExpandedContactHeader
          contact={contact}
          mode={mode}
          onImageUploaded={onImageUploaded}
          onRemoveImage={onRemoveImage}
        />
      )}

      {/* CREATE MODE */}
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

      {/* Edit CONTACT MODE */}
      {mode !== "create" && (
        <>

          {/* Name */}
          {!isLockedContactInfo && (
            <TextField
              label="Name"
              value={contactDraft.name}
              onChange={(val) =>
                onChange("name", val)
              }
            />
          )}

          {/* General Notes */}
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

          {/* Note editor */}
          {isNoteMode && (
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
          )}

          <h3>Notes</h3>

          <TimestampedNotesList
            notes={contact?.timestampedNotes || []}
            onEditNote={onEditNote}
            onDeleteNote={onDeleteNote}
            readOnly={
              mode === "edit" ||
              mode === "edit-note"
            }
          />

          {mode === "view" && (
            <button
              className="floating-add-button"
              onClick={onAddNote}
              disabled={isSaving}
            >
              +
            </button>
          )}

        </>
      )}
    </div>
  );
}