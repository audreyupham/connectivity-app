import "./ContactDetailsLayout/ContactDetailsLayout.css"

export default function TextField({ label, value, onChange }) {
  return (
    <div className="field">
      <div className="field-label">{label}</div>
      <input
        className="field-input"
        type="text"
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
