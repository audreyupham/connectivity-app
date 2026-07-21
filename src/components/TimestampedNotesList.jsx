import "./ContactDetailsLayout/ContactDetailsLayout.css"

export default function TimestampedNotesList({ notes }) {
  if (!notes || notes.length === 0) {
    return <div className="no-notes">No timestamped notes yet.</div>;
  }

  return (
    <div className="timestamped-notes">
      <h3>Notes</h3>
      {notes.map((n, idx) => (
        <div key={idx} className="note-item">
          <div className="note-timestamp">{n.timestamp}</div>
          <div className="note-text">{n.text}</div>
        </div>
      ))}
    </div>
  );
}
