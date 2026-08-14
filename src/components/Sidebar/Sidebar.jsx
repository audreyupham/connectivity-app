import "./Sidebar.css";

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../utils/api";

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);

  const openSidebar = () => {
    setIsOpen(true);
    document.body.classList.add("sidebar-open");
  };

  const closeSidebar = () => {
    setIsOpen(false);
    document.body.classList.remove("sidebar-open");
  };


  const [followUpCount, setFollowUpCount] = useState(0);

  useEffect(() => {
    async function loadFollowUps() {
      const res = await api.get("/contacts/followups");
      if (res.ok) {
        setFollowUpCount(res.data.length);
      }
    }
    loadFollowUps();
  }, []);

  useEffect(() => {
    function handleFollowUpCompleted() {
      setFollowUpCount(c => Math.max(0, c - 1));
    }

    window.addEventListener("followup-completed", handleFollowUpCompleted);

    return () => {
      window.removeEventListener("followup-completed", handleFollowUpCompleted);
    };
  }, []);


  return (
    <>
      {/* Mobile menu button */}
      <button
        className="sidebar-toggle"
        onClick={openSidebar}
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
            <Link to="/followups" onClick={closeSidebar}>
              Follow-Ups {followUpCount > 0 && `(${followUpCount})`}
            </Link>
          </p>

          <p>
            <Link to="/support" onClick={closeSidebar}>
              Support
            </Link>
          </p>

          <p>
            <Link to="/profile" onClick={closeSidebar}>
              Account
            </Link>
          </p>


        </nav>
      </aside>
    </>
  );
}