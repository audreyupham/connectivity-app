import "./ContactDetailsLayout.css";
import ExpandedContactHeader from "../ExpandedContactHeader";
import Label from "../Label";
import TextField from "../TextField";
import TextAreaField from "../TextAreaField";
import TimestampedNotesList from "../TimestampedNotesList";

export default function ContactDetailsLayout({
  contact,
  contactDraft,
  mode, // "view", "edit", "add-note", "edit-note", "create"
  onChange,
  onSave,
  onEdit,
  onAddNote,
  onBack,
  onCancel,
  onEditNote,
  onDeleteNote,
  onDeleteContact,
  isSaving = false,
  error = null
}) {
  // MODE: CREATE (contact is null or creating)
  if (mode === "create") {
    return (
      <div className="contact-details-layout">
        <div className="top-right-button">
          <button onClick={onSave} disabled={isSaving}>Save</button>
        </div>

        <div className="top-left-button">
          <button onClick={onCancel} disabled={isSaving}>Cancel</button>
        </div>

        {error && <div className="error">{error.message || "Error"}</div>}

        <TextField
          label="Name"
          value={contactDraft.name}
          onChange={(val) => onChange("name", val)}
        />

        <TextAreaField
          label="General Notes"
          value={contactDraft.generalNotes}
          onChange={(val) => onChange("generalNotes", val)}
        />
      </div>
    );
  }

  // MODE: EDIT-NOTE (note editor only)
  if (mode === "edit-note") {
    return (
      <div className="contact-details-layout">
        <ExpandedContactHeader contact={contact} />

        <div className="top-right-button">
          <button onClick={onSave} disabled={isSaving}>Save</button>
        </div>

        <div className="top-left-button">
          <button onClick={onCancel} disabled={isSaving}>Cancel</button>
        </div>

        {error && <div className="error">{error.message || "Error"}</div>}

        <Label label="Name" value={contact?.name} />
        <Label label="General Notes" value={contact?.generalNotes} />

        <TextAreaField
          label="Edit Note"
          value={contactDraft.newNote}
          onChange={(val) => onChange("newNote", val)}
        />
      </div>
    );
  }

  // MODE: ADD-NOTE
  if (mode === "add-note") {
    return (
      <div className="contact-details-layout">
        <ExpandedContactHeader contact={contact} />

        <div className="top-right-button">
          <button onClick={onSave} disabled={isSaving}>Save</button>
        </div>

        <div className="top-left-button">
          <button onClick={onCancel} disabled={isSaving}>Cancel</button>
        </div>

        {error && <div className="error">{error.message || "Error"}</div>}

        <Label label="Name" value={contact?.name} />
        <Label label="General Notes" value={contact?.generalNotes} />

        <TextAreaField
          label="New Note"
          value={contactDraft.newNote}
          onChange={(val) => onChange("newNote", val)}
        />
      </div>
    );
  }

  // MODES: VIEW and EDIT (default layout)
  return (
    <div className="contact-details-layout">
      <ExpandedContactHeader contact={contact} />

      {/* Top-right button: explicit branches per mode */}
      <div className="top-right-button">
        {mode === "view" && <button onClick={onEdit}>Edit</button>}
        {mode === "edit" && <button onClick={onSave} disabled={isSaving}>Save</button>}
        <button
          className="delete"
          onClick={() => onDeleteContact && onDeleteContact(contact?.id)}
          disabled={isSaving}
        >Delete</button>
      </div>

      {/* Top-left button */}
      <div className="top-left-button">
        {mode === "view" && <button onClick={onBack}>Back</button>}
        {mode === "edit" && <button onClick={onCancel} disabled={isSaving}>Cancel</button>}
      </div>

      {error && <div className="error">{error.message || "Error"}</div>}

      {/* Name field */}
      {mode === "view" ? (
        <Label label="Name" value={contact?.name} />
      ) : (
        <TextField
          label="Name"
          value={contactDraft.name}
          onChange={(val) => onChange("name", val)}
        />
      )}

      {/* General Notes field */}
      {mode === "view" ? (
        <Label label="General Notes" value={contact?.generalNotes} />
      ) : (
        <TextAreaField
          label="General Notes"
          value={contactDraft.generalNotes}
          onChange={(val) => onChange("generalNotes", val)}
        />
      )}

      {/* Timestamped notes: show in view and edit, but disable actions in edit */}
      <TimestampedNotesList
        notes={contact?.timestampedNotes || []}
        onEditNote={onEditNote}
        onDeleteNote={onDeleteNote}
        readOnly={mode === "edit" || mode === "create" || mode === "edit-note"}
      />


      {/* Floating + button */}
      {mode === "view" && (
        <button className="floating-add-button" onClick={onAddNote} disabled={isSaving}>
          +
        </button>
      )}
    </div>
  );
}