//TODO: Button to add contact appears on every screen except logins
import { useState } from "react";
import "./FloatingButton.css";
import { Link } from "react-router-dom";

export default function FloatingButton() {
    return (
        <Link to='/create-new' className="create-new">
            <button>
                <strong>+</strong>
            </button>
        </Link>
        
    );
}