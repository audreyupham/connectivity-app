import "./ContactDetailsLayout/ContactDetailsLayout.css"

export default function Label({ label, value }) {
  return (
    <div className="field">
      <div className="field-label">{label}</div>
      <div className="field-value">{value || ""}</div>
    </div>
  );
}
