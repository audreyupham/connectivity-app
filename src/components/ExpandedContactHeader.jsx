import "./ContactDetailsLayout/ContactDetailsLayout.css"
import defaultAvatar from "../assets/default-avatar.png"

export default function ExpandedContactHeader({ contact }) {
  return (
    <div className="expanded-contact-header">
      <img
        src={contact?.avatarUrl || defaultAvatar}
        alt=""
        className="contact-avatar"
      />
      <h2 className="contact-name">{contact?.name ?? ""}</h2>
    </div>
  );
}