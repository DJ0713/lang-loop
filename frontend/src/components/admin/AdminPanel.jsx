import React, { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";

function AdminPanel() {
  const [stats, setStats] = useState(null);
  const [recentUsers, setRecentUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [statsRes, usersRes] = await Promise.all([
        api.get("/admin/stats"),
        api.get("/admin/users"),
      ]);
      setStats(statsRes.data);
      setRecentUsers(Array.isArray(usersRes.data) ? usersRes.data.slice(-5).reverse() : []);
    } catch (err) {
      if (err.response?.status === 403) {
        setError("You do not have permission to perform this action.");
      } else {
        setError(err.response?.data?.message || "Failed to load admin dashboard data.");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <div>
      <div style={{ marginBottom: "28px" }}>
        <div className="eyebrow-text" style={{ marginBottom: "6px" }}>
          <span>PLATFORM OPERATIONS & TELEMETRY</span>
        </div>
        <h2 style={{ fontSize: "32px", fontWeight: "800", color: "var(--text-primary)", letterSpacing: "-0.8px" }}>
          Platform Administration
        </h2>
        <p style={{ color: "var(--text-secondary)", fontSize: "14.5px", marginTop: "4px" }}>
          Monitor system metrics, platform volume, and administrative operations.
        </p>
      </div>

      {error && (
        <div style={{ marginBottom: "20px" }}>
          <p role="alert" className="alert-error">
            {error}
          </p>
          <button
            type="button"
            className="btn-secondary"
            onClick={fetchData}
            style={{ marginTop: "8px" }}
          >
            Retry
          </button>
        </div>
      )}

      {loading ? (
        <div style={{ padding: "40px 0", color: "var(--text-muted)", textAlign: "center" }}>
          Loading admin dashboard...
        </div>
      ) : stats ? (
        <>
          {/* Key Metrics Grid */}
          <div className="metrics-grid" style={{ marginBottom: "28px" }}>
            <div className="metric-card">
              <div className="metric-header">
                <h3 className="metric-title">Total Platform Users</h3>
                <div className="metric-icon-box">👥</div>
              </div>
              <p className="metric-value">{stats.totalUsers}</p>
            </div>

            <div className="metric-card">
              <div className="metric-header">
                <h3 className="metric-title">Active Learners</h3>
                <div className="metric-icon-box" style={{ color: "var(--primary-light)", background: "rgba(59, 130, 246, 0.1)" }}>
                  🎓
                </div>
              </div>
              <p className="metric-value">{stats.totalLearners}</p>
            </div>

            <div className="metric-card">
              <div className="metric-header">
                <h3 className="metric-title">Staff Linguists</h3>
                <div className="metric-icon-box" style={{ color: "var(--warning)", background: "var(--warning-bg)" }}>
                  ✍️
                </div>
              </div>
              <p className="metric-value">{stats.totalLinguists}</p>
            </div>

            <div className="metric-card">
              <div className="metric-header">
                <h3 className="metric-title">Administrators</h3>
                <div className="metric-icon-box" style={{ color: "var(--success)", background: "var(--success-bg)" }}>
                  🛡️
                </div>
              </div>
              <p className="metric-value">{stats.totalAdmins}</p>
            </div>

            <div className="metric-card">
              <div className="metric-header">
                <h3 className="metric-title">Total Study Decks</h3>
                <div className="metric-icon-box">📚</div>
              </div>
              <p className="metric-value">{stats.totalDecks}</p>
            </div>

            <div className="metric-card">
              <div className="metric-header">
                <h3 className="metric-title">Total Flashcards</h3>
                <div className="metric-icon-box">🗂️</div>
              </div>
              <p className="metric-value">{stats.totalFlashcards}</p>
            </div>

            <div className="metric-card">
              <div className="metric-header">
                <h3 className="metric-title">Completed Study Sessions</h3>
                <div className="metric-icon-box">⏱️</div>
              </div>
              <p className="metric-value">{stats.totalStudySessions}</p>
            </div>
          </div>

          {/* Quick Actions & Recent Users */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "24px", marginBottom: "28px" }}>
            <div className="saas-card">
              <h3 style={{ fontSize: "16px", fontWeight: "700", color: "var(--text-primary)", marginBottom: "16px" }}>
                Administrative Navigation
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <Link to="/users" className="btn-secondary" style={{ textDecoration: "none", justifyContent: "flex-start" }}>
                  <span>👥</span>
                  <span>Manage Platform Users & Roles</span>
                </Link>
                <Link to="/admin/decks" className="btn-secondary" style={{ textDecoration: "none", justifyContent: "flex-start" }}>
                  <span>📚</span>
                  <span>Manage All Study Decks</span>
                </Link>
                <Link to="/admin/flashcards" className="btn-secondary" style={{ textDecoration: "none", justifyContent: "flex-start" }}>
                  <span>🗂️</span>
                  <span>Flashcard Repository Explorer</span>
                </Link>
                <Link to="/admin/analytics" className="btn-secondary" style={{ textDecoration: "none", justifyContent: "flex-start" }}>
                  <span>📊</span>
                  <span>Platform Analytics & Proportions</span>
                </Link>
                <Link to="/decks/create" className="btn-primary" style={{ textDecoration: "none", justifyContent: "flex-start", marginTop: "6px" }}>
                  <span>➕</span>
                  <span>Create Official Deck</span>
                </Link>
              </div>
            </div>

            <div className="saas-card">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                <h3 style={{ fontSize: "16px", fontWeight: "700", color: "var(--text-primary)" }}>
                  Recently Registered Users
                </h3>
                <Link to="/users" style={{ fontSize: "12px", color: "var(--primary-light)", textDecoration: "none", fontWeight: "600" }}>
                  View All &rarr;
                </Link>
              </div>

              {recentUsers.length === 0 ? (
                <p style={{ color: "var(--text-muted)", fontSize: "13px" }}>No users found.</p>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  {recentUsers.map((u) => (
                    <div
                      key={u.id}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: "10px 12px",
                        background: "var(--bg-subtle)",
                        borderRadius: "var(--radius-md)",
                        border: "1px solid var(--border-subtle)",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <div
                          style={{
                            width: "28px",
                            height: "28px",
                            borderRadius: "50%",
                            background: "var(--surface-card)",
                            border: "1px solid var(--border-light)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "11px",
                            fontWeight: "700",
                            color: "var(--text-secondary)",
                          }}
                        >
                          {u.username.slice(0, 2).toUpperCase()}
                        </div>
                        <span style={{ fontWeight: "600", color: "var(--text-primary)", fontSize: "13.5px" }}>
                          {u.username}
                        </span>
                      </div>
                      <span className="deck-tag" style={{ fontSize: "11px" }}>
                        {u.role}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
}

export default AdminPanel;
