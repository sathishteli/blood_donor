import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

const Navbar = ({ onLogout }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="logo">❤️ LifeLink</div>
      
      <div className="hamburger" onClick={toggleMenu}>
        <span className={isMenuOpen ? "bar open" : "bar"}></span>
        <span className={isMenuOpen ? "bar open" : "bar"}></span>
        <span className={isMenuOpen ? "bar open" : "bar"}></span>
      </div>

      <ul className={isMenuOpen ? "nav-links active" : "nav-links"}>
        <li><Link to="/" onClick={closeMenu}>Home</Link></li>
        <li><Link to="/donors" onClick={closeMenu}>Find Donors</Link></li>
        <li><Link to="/notifications" onClick={closeMenu}>Notifications</Link></li>
        <li><Link to="/profile" onClick={closeMenu}>Profile</Link></li>
        <li>
          <button 
            onClick={() => { closeMenu(); onLogout(); }}
            className="logout-btn"
          >
            Logout
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
