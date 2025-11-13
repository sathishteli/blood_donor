import React from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

const Navbar = ({ onLogout }) => (
  <nav className="navbar">
    <div className="logo">❤️ LifeLink</div>
    <ul className="nav-links">
      <li><Link to="/">Home</Link></li>
      <li><Link to="/donors">Find Donors</Link></li>
      <li><Link to="/notifications">Notifications</Link></li>
      <li><Link to="/profile">Profile</Link></li>
      <li>
        <button 
          onClick={onLogout}
          className="logout-btn"
        >
          Logout
        </button>
      </li>
    </ul>
  </nav>
);

export default Navbar;
