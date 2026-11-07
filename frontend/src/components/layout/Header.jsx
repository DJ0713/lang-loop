import React from "react";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";

function Header() {
  const location = useLocation();
  const user = useSelector((state) => state.auth?.user);

  const getPageTitle = () => {
    const path = location.pathname;
    if (path.startsWith("/dashboard")) return "Dashboard";
    if (path === "/decks") return "Learning Roadmaps";
    if (path === "/decks/create") return "Create New Deck";
    if (path.includes("/edit")) return "Edit Deck";
    if (path.startsWith("/decks/")) return "Deck Overview";
    if (path.startsWith("/study")) return "Study Mode";
    if (path === "/profile") return "User Profile";
    if (path === "/users") return "User Directory";
    if (path === "/admin") return "Admin Dashboard";
    if (path === "/admin/decks") return "Deck Management";
    if (path === "/admin/flashcards") return "Flashcard Explorer";
    if (path === "/admin/analytics") return "Platform Analytics";
    return "Workspace";
  };

  const username = user?.username || "Guest";
  const role = user?.role || "LEARNER";
  const initials = username.slice(0, 2).toUpperCase();

  return (
    <header className="app-header">
      <div className="header-page-title">
        {getPageTitle()}
      </div>

      <div className="header-right-actions">
        <button
          type="button"
          className="header-icon-btn"
          title="Notifications"
          aria-label="Notifications"
        >
          <span>🔔</span>
        </button>

        <div className="user-profile-pill">
          <div className="user-avatar-circle">
            {initials}
          </div>
          <div className="user-meta-info">
            <span className="user-meta-name">{username}</span>
            <span className="user-meta-role">{role}</span>
          </div>
          <span style={{ fontSize: "10px", color: "var(--text-muted)", marginLeft: "4px" }}>▼</span>
        </div>
      </div>
    </header>
  );
}

export default Header;
