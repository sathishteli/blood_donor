import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './styles/App.css';
import '@fortawesome/fontawesome-free/css/all.min.css'; // ✅ Font Awesome icons

const root = createRoot(document.getElementById('root'));
root.render(<App />);
