import "./Sidebar.css";

import { useState } from "react";
import { Link } from "react-router-dom";

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);

  const closeSidebar = () => {
    setIsOpen(false);
  };

  return (
    <>
      {/* Mobile menu button */}
      <button
        className="sidebar-toggle"
        onClick={() => setIsOpen(true)}
        aria-label="Open navigation menu"
        aria-expanded={isOpen}
      >
        ☰
      </button>

      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="sidebar-backdrop"
          onClick={closeSidebar}
          aria-hidden="true"
        />
      )}

      <aside className={`sidebar ${isOpen ? "sidebar-open" : ""}`}>
        <div className="sidebar-header">
          <h2>Menu</h2>

          {/* Mobile close button */}
          <button
            className="sidebar-close"
            onClick={closeSidebar}
            aria-label="Close navigation menu"
          >
            ☰
          </button>
        </div>

        <nav className="sidebar-nav">
          <p>
            <Link to="/contacts" onClick={closeSidebar}>
              Contacts
            </Link>
          </p>

          <p>
            <Link to="/create-new" onClick={closeSidebar}>
              Create New
            </Link>
          </p>

          <p>
            <Link to="/profile" onClick={closeSidebar}>
              Account
            </Link>
          </p>

          <p>
            <Link to="/support" onClick={closeSidebar}>
              Support
            </Link>
          </p>
        </nav>
      </aside>
    </>
  );
}