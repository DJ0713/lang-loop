import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../store/slices/authslice";

function Navbar({ user }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const reduxUser = useSelector((state) => state.auth?.user);
  const currentUser = user || reduxUser;
  const role = currentUser?.role || "LEARNER";

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const isActive = (path) => {
    if (path === "/decks" && location.pathname === "/decks") return true;
    if (path === "/decks/create" && location.pathname === "/decks/create") return true;
    return location.pathname === path;
  };

  return (
    <aside className="sidebar-container">
      <div className="brand-header">
        <div className="brand-logo-icon">LL</div>
        <div>
          <div className="brand-title">LANGLOOP</div>
          <div className="brand-subtitle">LANGUAGE • LEARN • LOOP</div>
        </div>
      </div>

      <div className="sidebar-role-badge">
        <span>Role</span>
        <span>{role}</span>
      </div>

      <nav className="sidebar-nav-scroll" role="navigation">
        <div className="nav-links-group">
          <div className="nav-section-label">WORKSPACE</div>
          
          <Link
            to="/dashboard"
            className={`sidebar-nav-link ${isActive("/dashboard") ? "active" : ""}`}
          >
            <span className="nav-icon">📊</span>
            <span>Dashboard</span>
          </Link>

          <Link
            to="/decks"
            className={`sidebar-nav-link ${isActive("/decks") ? "active" : ""}`}
          >
            <span className="nav-icon">🗺️</span>
            <span>Learning Roadmaps</span>
          </Link>

          {(role === "ADMIN" || role === "LINGUIST") && (
            <Link
              to="/decks/create"
              className={`sidebar-nav-link ${isActive("/decks/create") ? "active" : ""}`}
            >
              <span className="nav-icon">➕</span>
              <span>Create Deck</span>
            </Link>
          )}
        </div>

        {role === "ADMIN" && (
          <div className="nav-links-group">
            <div className="nav-section-label">ADMINISTRATION</div>
            <Link
              to="/admin"
              className={`sidebar-nav-link ${isActive("/admin") ? "active" : ""}`}
            >
              <span className="nav-icon">📊</span>
              <span>Dashboard</span>
            </Link>
            <Link
              to="/users"
              className={`sidebar-nav-link ${isActive("/users") ? "active" : ""}`}
            >
              <span className="nav-icon">👥</span>
              <span>Users</span>
            </Link>
            <Link
              to="/admin/decks"
              className={`sidebar-nav-link ${isActive("/admin/decks") ? "active" : ""}`}
            >
              <span className="nav-icon">📚</span>
              <span>Decks</span>
            </Link>
            <Link
              to="/admin/flashcards"
              className={`sidebar-nav-link ${isActive("/admin/flashcards") ? "active" : ""}`}
            >
              <span className="nav-icon">🗂️</span>
              <span>Flashcards</span>
            </Link>
            <Link
              to="/admin/analytics"
              className={`sidebar-nav-link ${isActive("/admin/analytics") ? "active" : ""}`}
            >
              <span className="nav-icon">📈</span>
              <span>Analytics</span>
            </Link>
          </div>
        )}

        <div className="nav-links-group">
          <div className="nav-section-label">ACCOUNT</div>
          <Link
            to="/profile"
            className={`sidebar-nav-link ${isActive("/profile") ? "active" : ""}`}
          >
            <span className="nav-icon">👤</span>
            <span>Profile</span>
          </Link>
        </div>
      </nav>

      <div className="sidebar-footer">
        <button
          type="button"
          className="btn-logout"
          onClick={handleLogout}
        >
          <span>🚪</span>
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}

export default Navbar;