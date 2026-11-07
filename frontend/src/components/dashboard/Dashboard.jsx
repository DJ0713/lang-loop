import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import api from "../../services/api";

function Dashboard() {
  const user = useSelector((state) => state.auth?.user);
  const username = user?.username || "Learner";

  const [stats, setStats] = useState({
    totalDecks: 0,
    totalFlashcards: 0,
    mastered: 0,
    progress: 0,
    streak: 0,
  });

  const [recentDecks, setRecentDecks] = useState([]);

  useEffect(() => {
    let isMounted = true;

    const fetchDashboardData = async () => {
      try {
        // Fetch dashboard statistics using API service
        const res = await api.get("/dashboard").catch(() => null);

        if (res && res.data && isMounted) {
          const d = res.data;
          const totalCards = d.totalFlashcards ?? 0;
          const masteredCount = d.masteredCards ?? d.mastered ?? 0;
          const calculatedProgress =
            totalCards > 0
              ? Math.round((masteredCount / totalCards) * 100)
              : (d.progress ?? 0);

          setStats({
            totalDecks: d.totalDecks ?? 0,
            totalFlashcards: totalCards,
            mastered: masteredCount,
            progress: calculatedProgress,
            streak: d.streak ?? 0,
          });
        }
      } catch (e) {
        // Fallback gracefully
      }

      try {
        const decksRes = await api.get("/decks").catch(() => null);
        if (decksRes && Array.isArray(decksRes.data) && isMounted) {
          setRecentDecks(decksRes.data.slice(0, 3));
        }
      } catch (e) {
        // Handle gracefully
      }
    };

    fetchDashboardData();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div>
      <div style={{ marginBottom: "32px" }}>
        <div className="eyebrow-text" style={{ marginBottom: "8px" }}>
          <span>NEURAL VOCABULARY ENGINE</span>
        </div>
        <h2 style={{ fontSize: "32px", fontWeight: "800", color: "var(--text-primary)", letterSpacing: "-0.8px", lineHeight: "1.15" }}>
          Welcome back, {username}
        </h2>
        <p style={{ color: "var(--text-secondary)", fontSize: "14.5px", marginTop: "6px" }}>
          Track your spaced repetition progress and continue your learning roadmap.
        </p>
      </div>

      {/* Primary Stat Cards */}
      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-header">
            <h3 className="metric-title">Total Decks</h3>
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
            <h3 className="metric-title">Mastered Cards</h3>
            <div className="metric-icon-box">⭐</div>
          </div>
          <p className="metric-value">{stats.mastered}</p>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <h3 className="metric-title">Overall Progress</h3>
            <div className="metric-icon-box">📈</div>
          </div>
          <p className="metric-value">{stats.progress}%</p>
        </div>
      </div>

      {/* Mastery Analytics & Visual Progress Section */}
      <div className="saas-card" style={{ marginBottom: "28px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
          <h3 style={{ fontSize: "16px", fontWeight: "700", color: "var(--text-primary)" }}>
            Mastery Analytics
          </h3>
          <span style={{ fontSize: "12px", color: "var(--primary-light)", fontWeight: "600" }}>
            {stats.progress}% Complete
          </span>
        </div>

        <div className="progress-track">
          <div
            className="progress-fill"
            style={{ width: `${Math.min(stats.progress, 100)}%` }}
          />
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", marginTop: "12px", fontSize: "13px", color: "var(--text-secondary)" }}>
          <p>
            You have mastered {stats.mastered} out of {stats.totalFlashcards} flashcards.
          </p>
          <p>Mastery: {stats.progress}%</p>
        </div>
      </div>

      {/* Recent Activity Section */}
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
          <h3 style={{ fontSize: "16px", fontWeight: "700", color: "var(--text-primary)" }}>
            Active Learning Roadmaps
          </h3>
          <Link to="/decks" style={{ color: "var(--primary-light)", textDecoration: "none", fontSize: "13px", fontWeight: "600" }}>
            View all roadmaps →
          </Link>
        </div>

        {recentDecks.length > 0 ? (
          <div className="deck-grid" style={{ marginTop: 0 }}>
            {recentDecks.map((deck) => (
              <div key={deck.id} className="deck-card">
                <div>
                  <div className="deck-card-header">
                    <h4 className="deck-title">{deck.title || deck.name}</h4>
                    <span className="deck-tag">{deck.languageTrack?.name || "Vocabulary"}</span>
                  </div>
                  <p style={{ fontSize: "13px", color: "var(--text-secondary)", marginBottom: "12px" }}>
                    {deck.description || "Master essential vocabulary with spaced repetition."}
                  </p>
                </div>
                <div className="deck-actions">
                  <Link to={`/decks/${deck.id}`} className="btn-secondary" style={{ textDecoration: "none" }}>
                    Open
                  </Link>
                  <Link to={`/study/${deck.id}`} className="btn-primary" style={{ textDecoration: "none" }}>
                    Study
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state-card" style={{ padding: "40px 20px" }}>
            <div className="empty-state-icon">📖</div>
            <h4 className="empty-state-title">No Recent Activity</h4>
            <p className="empty-state-desc">
              You haven't started any study sessions yet. Explore your learning roadmaps to begin practice.
            </p>
            <Link to="/decks" className="btn-primary" style={{ textDecoration: "none" }}>
              Explore Roadmaps
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;