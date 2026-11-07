import React, { useEffect, useState, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../../services/api";

function AdminDeckManagement() {
  const navigate = useNavigate();
  const [decks, setDecks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const fetchDecks = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await api.get("/decks");
      setDecks(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      if (err.response?.status === 403) {
        setError("You do not have permission to perform this action.");
      } else {
        setError(err.response?.data?.message || "Failed to load study decks.");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDecks();
  }, [fetchDecks]);

  const handleDelete = async (id, title) => {
    const confirmed = window.confirm(`Are you sure you want to delete deck "${title}"?`);
    if (!confirmed) return;

    try {
      const response = await api.delete(`/decks/${id}`);
      setDecks((current) => current.filter((deck) => deck.id !== id));
      setMessage(
        typeof response.data === "string"
          ? response.data
          : `Deck "${title}" deleted successfully.`
      );
    } catch (err) {
      if (err.response?.status === 403) {
        setError("You do not have permission to perform this action.");
      } else {
        setError(err.response?.data?.message || "Failed to delete deck");
      }
    }
  };

  const filteredDecks = decks.filter((deck) =>
    (deck.title || deck.name || "").toLowerCase().includes(search.toLowerCase()) ||
    (deck.mentorName || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px", marginBottom: "24px" }}>
        <div>
          <div className="eyebrow-text" style={{ marginBottom: "6px" }}>
            <span>ROADMAP CATALOG & AUDITING</span>
          </div>
          <h2 style={{ fontSize: "32px", fontWeight: "800", color: "var(--text-primary)", letterSpacing: "-0.8px" }}>
            Deck Management
          </h2>
          <p style={{ color: "var(--text-secondary)", fontSize: "14.5px", marginTop: "4px" }}>
            Admin-level overview and control of all language roadmaps and courses.
          </p>
        </div>

        <button
          type="button"
          className="btn-primary"
          onClick={() => navigate("/decks/create")}
        >
          + Create Official Deck
        </button>
      </div>

      {message && (
        <p role="status" className="alert-success" style={{ marginBottom: "20px" }}>
          {message}
        </p>
      )}

      {error && (
        <div style={{ marginBottom: "20px" }}>
          <p role="alert" className="alert-error">
            {error}
          </p>
          <button
            type="button"
            className="btn-secondary"
            onClick={fetchDecks}
            style={{ marginTop: "8px" }}
          >
            Retry
          </button>
        </div>
      )}

      <div style={{ marginBottom: "24px" }}>
        <input
          type="text"
          placeholder="Search decks by title or mentor..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ maxWidth: "420px" }}
        />
      </div>

      {loading ? (
        <div style={{ padding: "40px 0", color: "var(--text-muted)", textAlign: "center" }}>
          Loading decks...
        </div>
      ) : filteredDecks.length === 0 ? (
        <div className="empty-state-card">
          <div className="empty-state-icon">📚</div>
          <p className="empty-state-title">No Decks Found</p>
          <p className="empty-state-desc">No study decks match your search query.</p>
        </div>
      ) : (
        <div className="saas-card" style={{ padding: 0, overflow: "hidden" }}>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
              <thead>
                <tr
                  style={{
                    background: "var(--bg-subtle)",
                    borderBottom: "1px solid var(--border-subtle)",
                    color: "var(--text-muted)",
                    fontSize: "12px",
                    textTransform: "uppercase",
                  }}
                >
                  <th style={{ padding: "14px 20px" }}>ID</th>
                  <th style={{ padding: "14px 20px" }}>Deck Title</th>
                  <th style={{ padding: "14px 20px" }}>Mentor / Creator</th>
                  <th style={{ padding: "14px 20px" }}>Cards</th>
                  <th style={{ padding: "14px 20px" }}>Capacity</th>
                  <th style={{ padding: "14px 20px", textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredDecks.map((deck) => (
                  <tr
                    key={deck.id}
                    style={{
                      borderBottom: "1px solid var(--border-subtle)",
                      transition: "background var(--transition-fast)",
                    }}
                  >
                    <td style={{ padding: "14px 20px", color: "var(--text-muted)", fontSize: "13px" }}>
                      #{deck.id}
                    </td>
                    <td style={{ padding: "14px 20px", fontWeight: "600", color: "var(--text-primary)" }}>
                      <div>{deck.title || deck.name}</div>
                      <div style={{ fontSize: "12px", color: "var(--text-muted)", fontWeight: "normal" }}>
                        {deck.description || "No description provided"}
                      </div>
                    </td>
                    <td style={{ padding: "14px 20px", color: "var(--text-secondary)", fontSize: "13.5px" }}>
                      {deck.mentorName || deck.owner?.username || "Instructor"}
                    </td>
                    <td style={{ padding: "14px 20px" }}>
                      <span className="deck-tag">
                        {deck.flashcards ? deck.flashcards.length : 0} cards
                      </span>
                    </td>
                    <td style={{ padding: "14px 20px", color: "var(--text-muted)", fontSize: "13px" }}>
                      {deck.capacity || 50}
                    </td>
                    <td style={{ padding: "14px 20px", textAlign: "right" }}>
                      <div style={{ display: "inline-flex", gap: "8px" }}>
                        <Link
                          to={`/decks/${deck.id}`}
                          className="btn-secondary"
                          style={{ padding: "6px 12px", fontSize: "12px", textDecoration: "none" }}
                        >
                          View
                        </Link>
                        <button
                          type="button"
                          className="btn-secondary"
                          style={{ padding: "6px 12px", fontSize: "12px" }}
                          onClick={() => navigate(`/decks/${deck.id}/edit`)}
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          className="btn-danger"
                          style={{ padding: "6px 12px", fontSize: "12px" }}
                          onClick={() => handleDelete(deck.id, deck.title || deck.name)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDeckManagement;
