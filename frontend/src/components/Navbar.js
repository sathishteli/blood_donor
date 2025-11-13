import React from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => (
  <nav className="navbar">
    <div className="logo">❤️ LifeLink</div>
    <ul className="nav-links">
      <li><Link to="/">Home</Link></li>
      <li><Link to="/donors">Find Donors</Link></li>
      <li><Link to="/register">Register</Link></li>
      <li><Link to="/login">Login</Link></li>
      <li><Link to="/notifications">Notifications</Link></li>
    </ul>
  </nav>
);

export default Navbar;
