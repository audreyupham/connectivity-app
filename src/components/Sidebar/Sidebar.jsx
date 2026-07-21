// src/components/Sidebar/Sidebar.jsx
import "./Sidebar.css";

import { Link } from "react-router-dom";


export default function Sidebar() {
  return (
    <aside className="sidebar">
      <h2></h2>
        <p><Link to="/contacts">Contacts</Link></p>
        <p><Link to="/create-new">Create New</Link></p>
        <p><Link to="/ai-search">AI Search</Link></p>
        <p><Link to="/profile">Account</Link></p>
    </aside>
  );
}
