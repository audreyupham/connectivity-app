import "./ContactDetailsLayout/ContactDetailsLayout.css";
import defaultAvatar from "../assets/default-avatar.png";
import api from "../utils/api";

export default function ExpandedContactHeader({
  contact,
  mode,
  onImageUploaded,
  onRemoveImage
}) {

  async function handleImageUpload(e) {
    const file = e.target.files[0];

    if (!file) return;

    const formData = new FormData();

    formData.append("image", file);

    const { ok, data } = await api.post(
      `/contacts/${contact.id}/image`,
      formData
    );

    if (ok) {
      onImageUploaded(data);
    }
  }

  return (
    <div className="expanded-contact-header">

      {mode === "edit" && (
        <div className="image-controls">

          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
          />

          {contact?.imageUrl && (
            <button
              type="button"
              className="remove-image-button"
              onClick={onRemoveImage}
            >
              Remove Image
            </button>
          )}
        </div>
      )}

      <img
        src={
          contact?.imageUrl
            ? `http://localhost:3001${contact.imageUrl}`
            : defaultAvatar
        }
        alt={`${contact.name}'s profile picture`}
        className="contact-avatar"
      />

      {mode === "view" && (
        <h2 className="contact-name">
          {contact?.name ?? ""}
        </h2>
      )}
    </div>
  );
}