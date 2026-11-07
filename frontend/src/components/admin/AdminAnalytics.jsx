import React, { useEffect, useState, useCallback } from "react";
import api from "../../services/api";

function AdminAnalytics() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchStats = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await api.get("/admin/stats");
      setStats(response.data);
    } catch (err) {
      if (err.response?.status === 403) {
        setError("You do not have permission to perform this action.");
      } else {
        setError(err.response?.data?.message || "Failed to load analytics.");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const totalUsers = stats?.totalUsers || 0;
  const learnersPercent = totalUsers > 0 ? Math.round((stats.totalLearners / totalUsers) * 100) : 0;
  const linguistsPercent = totalUsers > 0 ? Math.round((stats.totalLinguists / totalUsers) * 100) : 0;
  const adminsPercent = totalUsers > 0 ? Math.round((stats.totalAdmins / totalUsers) * 100) : 0;

  const totalDecks = stats?.totalDecks || 0;
  const totalCards = stats?.totalFlashcards || 0;
  const cardsPerDeck = totalDecks > 0 ? (totalCards / totalDecks).toFixed(1) : 0;

  return (
    <div>
      <div style={{ marginBottom: "28px" }}>
        <div className="eyebrow-text" style={{ marginBottom: "6px" }}>
          <span>DEMOGRAPHICS & CONTENT DENSITY</span>
        </div>
        <h2 style={{ fontSize: "32px", fontWeight: "800", color: "var(--text-primary)", letterSpacing: "-0.8px" }}>
          Platform Analytics
        </h2>
        <p style={{ color: "var(--text-secondary)", fontSize: "14.5px", marginTop: "4px" }}>
          Data distributions, user demographics, and content density computed from database metrics.
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
            onClick={fetchStats}
            style={{ marginTop: "8px" }}
          >
            Retry
          </button>
        </div>
      )}

      {loading ? (
        <div style={{ padding: "40px 0", color: "var(--text-muted)", textAlign: "center" }}>
          Loading platform analytics...
        </div>
      ) : stats ? (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))", gap: "24px" }}>
          {/* User Demographic Distribution */}
          <div className="saas-card">
            <h3 style={{ fontSize: "16px", fontWeight: "700", color: "var(--text-primary)", marginBottom: "8px" }}>
              User Demographics by Role
            </h3>
            <p style={{ fontSize: "13px", color: "var(--text-muted)", marginBottom: "20px" }}>
              Distribution across {stats.totalUsers} registered platform accounts.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
              {/* Learners */}
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", marginBottom: "6px" }}>
                  <span style={{ fontWeight: "600", color: "var(--text-primary)" }}>
                    🎓 Learners
                  </span>
                  <span style={{ color: "var(--text-muted)" }}>
                    {stats.totalLearners} ({learnersPercent}%)
                  </span>
                </div>
                <div className="progress-track" style={{ height: "10px", margin: 0 }}>
                  <div
                    className="progress-fill"
                    style={{
                      width: `${learnersPercent}%`,
                      background: "linear-gradient(90deg, #3b82f6, #60a5fa)",
                    }}
                  />
                </div>
              </div>

              {/* Linguists */}
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", marginBottom: "6px" }}>
                  <span style={{ fontWeight: "600", color: "var(--text-primary)" }}>
                    ✍️ Linguists
                  </span>
                  <span style={{ color: "var(--text-muted)" }}>
                    {stats.totalLinguists} ({linguistsPercent}%)
                  </span>
                </div>
                <div className="progress-track" style={{ height: "10px", margin: 0 }}>
                  <div
                    className="progress-fill"
                    style={{
                      width: `${linguistsPercent}%`,
                      background: "linear-gradient(90deg, #fbbf24, #f59e0b)",
                    }}
                  />
                </div>
              </div>

              {/* Admins */}
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", marginBottom: "6px" }}>
                  <span style={{ fontWeight: "600", color: "var(--text-primary)" }}>
                    🛡️ Admins
                  </span>
                  <span style={{ color: "var(--text-muted)" }}>
                    {stats.totalAdmins} ({adminsPercent}%)
                  </span>
                </div>
                <div className="progress-track" style={{ height: "10px", margin: 0 }}>
                  <div
                    className="progress-fill"
                    style={{
                      width: `${adminsPercent}%`,
                      background: "linear-gradient(90deg, #5ee6ad, #10b981)",
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Content & Study Metrics */}
          <div className="saas-card">
            <h3 style={{ fontSize: "16px", fontWeight: "700", color: "var(--text-primary)", marginBottom: "8px" }}>
              Content Density & Engagement
            </h3>
            <p style={{ fontSize: "13px", color: "var(--text-muted)", marginBottom: "20px" }}>
              Real metrics aggregated across language tracks and sessions.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "12px 14px",
                  background: "var(--bg-subtle)",
                  borderRadius: "var(--radius-md)",
                  border: "1px solid var(--border-subtle)",
                }}
              >
                <span style={{ fontSize: "13.5px", color: "var(--text-secondary)" }}>
                  Average Cards per Deck
                </span>
                <span style={{ fontSize: "16px", fontWeight: "700", color: "var(--text-primary)" }}>
                  {cardsPerDeck}
                </span>
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "12px 14px",
                  background: "var(--bg-subtle)",
                  borderRadius: "var(--radius-md)",
                  border: "1px solid var(--border-subtle)",
                }}
              >
                <span style={{ fontSize: "13.5px", color: "var(--text-secondary)" }}>
                  Total Flashcards Repository
                </span>
                <span style={{ fontSize: "16px", fontWeight: "700", color: "var(--primary-light)" }}>
                  {stats.totalFlashcards}
                </span>
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "12px 14px",
                  background: "var(--bg-subtle)",
                  borderRadius: "var(--radius-md)",
                  border: "1px solid var(--border-subtle)",
                }}
              >
                <span style={{ fontSize: "13.5px", color: "var(--text-secondary)" }}>
                  Total Study Sessions Recorded
                </span>
                <span style={{ fontSize: "16px", fontWeight: "700", color: "var(--success)" }}>
                  {stats.totalStudySessions}
                </span>
              </div>

              {stats.totalStudySessions === 0 && (
                <div style={{ marginTop: "8px", fontSize: "12.5px", color: "var(--text-muted)", textAlign: "center" }}>
                  No study activity yet
                </div>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default AdminAnalytics;
