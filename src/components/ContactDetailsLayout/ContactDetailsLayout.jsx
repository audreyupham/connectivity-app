import "./ContactDetailsLayout.css";
import ExpandedContactHeader from "../ExpandedContactHeader";
import Label from "../Label";
import TextField from "../TextField";
import TextAreaField from "../TextAreaField";
import TimestampedNotesList from "../TimestampedNotesList";

export default function ContactDetailsLayout({
  contact,
  contactDraft,
  mode, // "view", "edit", "add-note", "create"
  onChange,
  onSave,
  onEdit,
  onAddNote
}) {
  return (
    <div className="contact-details-layout">

      <ExpandedContactHeader contact={contact} />
      
      {/* Top-right button */}
      <div className="top-right-button">
        {mode === "view" && (
          <button onClick={onEdit}>Edit</button>
        )}

        {(mode === "edit" || mode === "create" || mode === "add-note") && (
          <button onClick={onSave}>Save</button>
        )}
      </div>

      {/* Name field */}
      {mode === "view" || mode === "add-note" ? (
        <Label label="Name" value={contact?.name ?? ""} />
      ) : (
        <TextField
          label="Name"
          value={contactDraft.name}
          onChange={(val) => onChange("name", val)}
        />
      )}

      {/* General Notes field */}
      {mode === "view" || mode === "add-note" ? (
        <Label label="General Notes" value={contact?.generalNotes ?? ""} />
      ) : (
        <TextAreaField
          label="General Notes"
          value={contactDraft.generalNotes}
          onChange={(val) => onChange("generalNotes", val)}
        />
      )}

      {/* Timestamped notes */}
      <TimestampedNotesList notes={contact?.timestampedNotes ?? []} />

      {/* Floating + button (only in view mode) */}
      {mode === "view" && (
        <button className="floating-add-button" onClick={onAddNote}>
          +
        </button>
      )}

      {/* Add-note mode: new note field */}
      {mode === "add-note" && (
        
        <TextAreaField
          label="New Note"
          value={contactDraft.newNote}
          onChange={(val) => onChange("newNote", val)}
        />
        
        
      ) }
    </div>
  );
}
