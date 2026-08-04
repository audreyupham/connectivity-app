import { Link } from "react-router-dom";
import "./LoginLayout.css";

export default function LoginLayout({
  title = "Login",
  children,
  links,
}) {
  return (
    <div className="login-layout">
      <div className="login-card">
        <h1 className="login-title">Connectivity</h1>

        <div className="login-box">
          <h2 className="login-heading">{title}</h2>

          <div className="login-form-container">
            {children}
          </div>

          <div className="login-links-row">
            {links?.left && (
              <Link
                to={links.left.to}
                className="login-link left-link"
              >
                {links.left.label}
              </Link>
            )}

            {links?.right && (
              <Link
                to={links.right.to}
                className="login-link right-link"
              >
                {links.right.label}
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}