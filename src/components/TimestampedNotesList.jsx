import {formatTimestamp} from "../utils/formatTimestamp.js"
import "./TimestampedNotesList.css"
import editIcon from "../assets/edit-icon.png";
import deleteIcon from "../assets/delete-icon.png";

export default function TimestampedNotesList({ 
  notes,
  onEditNote,
  onDeleteNote,
  readOnly = false
 }) {
  if (!notes || notes.length === 0) {
    return <div className="no-notes">No timestamped notes yet.</div>;
  }

  const sortedNotes = [...notes].sort(
    (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
  );

  return (
    <div className="timestamped-notes">
      
      {sortedNotes.map(note => (
        <div key={note.id} className="note-item">
          <span className="note-timestamp">{formatTimestamp(note.timestamp)}</span>
          <div className="note-text">{note.text}</div>
          
          {!readOnly && (
            <div className="note-actions">
              <button
                className="icon-button"
                onClick={() => onEditNote(note)}
                aria-label="Edit note"
              >
                <img 
                  src={editIcon}
                  alt="Edit"
                />
              </button>

              <button
                className="icon-button delete-icon"
                onClick={() => {
                  if (window.confirm("Delete this note?")) {
                    onDeleteNote(note.id);
                  }
                }}
                aria-label="Delete note"
              >
                <img
                  src={deleteIcon}
                  alt="Delete"
                />
              </button>
            </div>
          )}
        </div>
      ))}
      </div>
  );
}