import React, { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";

function AdminFlashcardManagement() {
  const [flashcards, setFlashcards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [deckFilter, setDeckFilter] = useState("ALL");
  const [error, setError] = useState("");

  const fetchFlashcards = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await api.get("/admin/flashcards");
      setFlashcards(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      if (err.response?.status === 403) {
        setError("You do not have permission to perform this action.");
      } else {
        setError(err.response?.data?.message || "Failed to load flashcards.");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFlashcards();
  }, [fetchFlashcards]);

  // Extract unique deck titles for filter dropdown
  const uniqueDecks = Array.from(
    new Set(flashcards.map((c) => c.deckTitle || "Unassigned"))
  );

  const filteredCards = flashcards.filter((card) => {
    const matchesSearch =
      (card.frontContent || "").toLowerCase().includes(search.toLowerCase()) ||
      (card.backContent || "").toLowerCase().includes(search.toLowerCase());
    const matchesDeck =
      deckFilter === "ALL" || (card.deckTitle || "Unassigned") === deckFilter;
    return matchesSearch && matchesDeck;
  });

  return (
    <div>
      <div style={{ marginBottom: "28px" }}>
        <div className="eyebrow-text" style={{ marginBottom: "6px" }}>
          <span>GLOBAL REPOSITORY INVENTORY</span>
        </div>
        <h2 style={{ fontSize: "32px", fontWeight: "800", color: "var(--text-primary)", letterSpacing: "-0.8px" }}>
          Flashcard Repository Explorer
        </h2>
        <p style={{ color: "var(--text-secondary)", fontSize: "14.5px", marginTop: "4px" }}>
          Browse and audit vocabulary items across all decks and learning tracks.
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
            onClick={fetchFlashcards}
            style={{ marginTop: "8px" }}
          >
            Retry
          </button>
        </div>
      )}

      {/* Search & Deck Filter */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "16px",
          marginBottom: "24px",
        }}
      >
        <input
          type="text"
          placeholder="Search by front or back content..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ maxWidth: "380px" }}
        />

        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <label style={{ fontSize: "13px", color: "var(--text-muted)" }}>Deck:</label>
          <select
            value={deckFilter}
            onChange={(e) => setDeckFilter(e.target.value)}
            style={{ width: "auto", minWidth: "180px" }}
          >
            <option value="ALL">All Decks ({flashcards.length})</option>
            {uniqueDecks.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div style={{ padding: "40px 0", color: "var(--text-muted)", textAlign: "center" }}>
          Loading flashcards...
        </div>
      ) : filteredCards.length === 0 ? (
        <div className="empty-state-card">
          <div className="empty-state-icon">🗂️</div>
          <p className="empty-state-title">No Flashcards Found</p>
          <p className="empty-state-desc">No cards match the current search or deck filter.</p>
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
                  <th style={{ padding: "14px 20px" }}>Front Content (Prompt)</th>
                  <th style={{ padding: "14px 20px" }}>Back Content (Answer)</th>
                  <th style={{ padding: "14px 20px" }}>Associated Deck</th>
                  <th style={{ padding: "14px 20px", textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCards.map((card) => (
                  <tr
                    key={card.id}
                    style={{
                      borderBottom: "1px solid var(--border-subtle)",
                      transition: "background var(--transition-fast)",
                    }}
                  >
                    <td style={{ padding: "14px 20px", color: "var(--text-muted)", fontSize: "13px" }}>
                      #{card.id}
                    </td>
                    <td style={{ padding: "14px 20px", fontWeight: "600", color: "var(--text-primary)" }}>
                      {card.frontContent}
                    </td>
                    <td style={{ padding: "14px 20px", color: "var(--success)", fontWeight: "500" }}>
                      {card.backContent}
                    </td>
                    <td style={{ padding: "14px 20px" }}>
                      <span className="deck-tag">
                        {card.deckTitle || "Unassigned"}
                      </span>
                    </td>
                    <td style={{ padding: "14px 20px", textAlign: "right" }}>
                      {card.deckId ? (
                        <Link
                          to={`/decks/${card.deckId}`}
                          className="btn-secondary"
                          style={{ padding: "6px 12px", fontSize: "12px", textDecoration: "none" }}
                        >
                          Open Deck
                        </Link>
                      ) : (
                        <span style={{ color: "var(--text-muted)", fontSize: "12px" }}>-</span>
                      )}
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

export default AdminFlashcardManagement;
