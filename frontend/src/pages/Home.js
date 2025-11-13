import React from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-overlay">
          <h1>Donate Blood, Save Lives ❤️</h1>
          <p>Join LifeLink — a network connecting lifesavers with those in need.</p>
          <div className="hero-buttons">
            <button onClick={() => navigate("/register")} className="btn-primary">
              Become a Donor
            </button>
            <button onClick={() => navigate("/donors")} className="btn-outline">
              Find Blood
            </button>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works">
        <h2>How It Works</h2>
        <div className="steps">
          <div className="card">
            <span className="icon">📝</span>
            <h3>Register</h3>
            <p>Join the donor community by filling your blood group, location, and contact info.</p>
          </div>
          <div className="card">
            <span className="icon">🔍</span>
            <h3>Search & Request</h3>
            <p>Recipients can instantly search and contact available donors nearby.</p>
          </div>
          <div className="card">
            <span className="icon">📩</span>
            <h3>Get Notified</h3>
            <p>Donors receive alerts when someone in their area urgently needs blood.</p>
          </div>
          <div className="card">
            <span className="icon">💖</span>
            <h3>Donate & Save Lives</h3>
            <p>Complete the donation and update your availability for the next one!</p>
          </div>
        </div>
      </section>

      {/* Why Donate Section */}
      <section className="why-donate">
        <h2>Why Donate Blood?</h2>
        <div className="reasons">
          <div className="reason">
            <span>💉</span>
            <p>Each donation can save up to 3 lives.</p>
          </div>
          <div className="reason">
            <span>🤝</span>
            <p>Builds a strong, caring community.</p>
          </div>
          <div className="reason">
            <span>⚡</span>
            <p>Fast, safe, and rewarding process.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <p>© 2025 LifeLink. Made with ❤️ to save lives.</p>
      </footer>
    </div>
  );
}

export default Home;
