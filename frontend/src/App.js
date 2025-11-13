import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import Donors from "./pages/Donors";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Notifications from "./pages/Notifications";
import "./styles/App.css";
import Profile from "./pages/Profile";


function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on component mount
    const user = localStorage.getItem("user");
    if (user) {
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setIsAuthenticated(false);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Router>
      {isAuthenticated && <Navbar onLogout={handleLogout} />}
      <Routes>
        {/* Public Routes */}
        <Route
          path="/login"
          element={
            isAuthenticated ? (
              <Navigate to="/" replace />
            ) : (
              <Login setIsAuthenticated={setIsAuthenticated} />
            )
          }
        />
        <Route
          path="/register"
          element={
            isAuthenticated ? (
              <Navigate to="/" replace />
            ) : (
              <Register />
            )
          }
        />

        {/* Protected Routes */}
        <Route
          path="/"
          element={<ProtectedRoute element={<Home />} isAuthenticated={isAuthenticated} />}
        />
        <Route
          path="/donors"
          element={<ProtectedRoute element={<Donors />} isAuthenticated={isAuthenticated} />}
        />
        <Route
          path="/notifications"
          element={
            <ProtectedRoute
              element={<Notifications />}
              isAuthenticated={isAuthenticated}
            />
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute element={<Profile />} isAuthenticated={isAuthenticated} />
          }
        />

        {/* Redirect unknown routes to login if not authenticated */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
