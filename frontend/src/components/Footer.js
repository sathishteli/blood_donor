import React from 'react';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <p>© {new Date().getFullYear()} LifeLink — Connect. Donate. Save Lives.</p>
      </div>
    </footer>
  );
}
