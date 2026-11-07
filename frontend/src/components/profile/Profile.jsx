import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../store/slices/authslice";
import { useNavigate } from "react-router-dom";

function Profile() {
  const user = useSelector((state) => state.auth?.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <div style={{ maxWidth: "600px" }}>
      <div style={{ marginBottom: "28px" }}>
        <div className="eyebrow-text" style={{ marginBottom: "6px" }}>
          <span>ACCOUNT & CREDENTIALS</span>
        </div>
        <h2 style={{ fontSize: "32px", fontWeight: "800", color: "var(--text-primary)", letterSpacing: "-0.8px" }}>
          User Profile
        </h2>
        <p style={{ color: "var(--text-secondary)", fontSize: "14.5px", marginTop: "4px" }}>
          Manage your LangLoop account credentials and preferences.
        </p>
      </div>

      <div className="saas-card">
        <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "24px", paddingBottom: "20px", borderBottom: "1px solid var(--border-subtle)" }}>
          <div className="user-avatar-circle" style={{ width: "54px", height: "54px", fontSize: "18px" }}>
            {(user?.username || "LL").slice(0, 2).toUpperCase()}
          </div>
          <div>
            <h3 style={{ fontSize: "18px", fontWeight: "700", color: "var(--text-primary)" }}>
              {user?.username || "Learner"}
            </h3>
            <span className="deck-tag" style={{ marginTop: "4px", display: "inline-block" }}>
              {user?.role || "LEARNER"}
            </span>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginBottom: "28px" }}>
          <div>
            <label style={{ color: "var(--text-muted)" }}>Username</label>
            <p style={{ fontSize: "15px", fontWeight: "600", color: "var(--text-primary)", marginTop: "4px" }}>
              {user?.username || "—"}
            </p>
          </div>

          <div>
            <label style={{ color: "var(--text-muted)" }}>Account Role</label>
            <p style={{ fontSize: "15px", fontWeight: "600", color: "var(--text-primary)", marginTop: "4px" }}>
              {user?.role || "LEARNER"}
            </p>
          </div>

          <div>
            <label style={{ color: "var(--text-muted)" }}>Application</label>
            <p style={{ fontSize: "15px", fontWeight: "600", color: "var(--text-primary)", marginTop: "4px" }}>
              LangLoop Spaced Repetition Platform
            </p>
          </div>
        </div>

        <button
          type="button"
          className="btn-danger"
          onClick={handleLogout}
        >
          Sign Out of LangLoop
        </button>
      </div>
    </div>
  );
}

export default Profile;
