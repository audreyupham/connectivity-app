import {formatTimestamp} from "../utils/formatTimestamp.js"
import "./TimestampedNotesList.css"


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
      <h3>Notes</h3>
      {sortedNotes.map(note => (
        <div key={note.id} className="note-item">
          <span className="note-timestamp">{formatTimestamp(note.timestamp)}</span>
          <div className="note-text">{note.text}</div>
          
          {!readOnly && (
            <div className="note-actions">
              <button onClick={() => onEditNote(note)}>Edit</button>
              <button onClick={() => onDeleteNote(note.id)}>Delete</button>
            </div>
          )}
        </div>
      ))}
      </div>
  );
}