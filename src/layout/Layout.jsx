//Controls sidebar, main content area, overall page structure. Wrap other pages in this
import React from "react";
import Sidebar from "../components/Sidebar/Sidebar";
import FloatingButton from "../components/FloatingButton/FloatingButton";
import "./Layout.css";

//SIDEBAR & Main Section
export default function Layout({ children, showFloatingButton = true }) {
  
    return (
    <div className="layout">
      <Sidebar />
      <main className="main-content">
        {children}
        {showFloatingButton && <FloatingButton />}
      </main>
    </div>
  );
}
