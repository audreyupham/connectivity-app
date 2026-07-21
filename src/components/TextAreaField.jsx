import "./ContactDetailsLayout/ContactDetailsLayout.css"

export default function TextAreaField({ label, value, onChange }) {
  return (
    <div className="field">
      <div className="field-label">{label}</div>
      <textarea
        className="field-textarea"
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        rows={4}
      />
    </div>
  );
}
