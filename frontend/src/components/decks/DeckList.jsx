import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import api from "../../services/api";

function DeckList({ role }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const reduxDecks = useSelector(
    (state) => state.decks?.items || state.decks?.decks || []
  );

  const reduxUser = useSelector(
    (state) => state.auth?.user
  );

  const currentRole = role || reduxUser?.role;
  const isLinguist = currentRole === "LINGUIST" || currentRole === "ADMIN";

  const [decks, setDecks] = useState(reduxDecks);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    setDecks(reduxDecks);
  }, [reduxDecks]);

  const fetchDecks = useCallback(async () => {
    setError("");

    try {
      const response = await api.get("/decks");

      const data = Array.isArray(response.data)
        ? response.data
        : [];

      setDecks(data);

      dispatch({
        type: "decks/setItems",
        payload: data,
      });
      dispatch({
        type: "deck/setDecks",
        payload: data,
      });
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to load decks"
      );
    }
  }, [dispatch]);

  useEffect(() => {
    fetchDecks();
  }, [fetchDecks]);

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this deck?"
    );

    if (!confirmed) {
      return;
    }

    try {
      const response = await api.delete(`/decks/${id}`);

      setDecks((current) =>
        current.filter((deck) => deck.id !== id)
      );

      setMessage(
        typeof response.data === "string"
          ? response.data
          : "StudyDeck deleted successfully."
      );
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to delete deck"
      );
    }
  };

  const handleEdit = (deck) => {
    navigate(`/decks/${deck.id}/edit`);
  };

  const filteredDecks = decks.filter((deck) =>
    (deck.title || deck.name || "")
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div>
      {/* Top Header Bar */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px", marginBottom: "24px" }}>
        <div>
          <div className="eyebrow-text" style={{ marginBottom: "6px" }}>
            <span>CURATED TRACKS & DECKS</span>
          </div>
          <h2 style={{ fontSize: "32px", fontWeight: "800", color: "var(--text-primary)", letterSpacing: "-0.8px" }}>
            Learning Roadmaps
          </h2>
          <p style={{ color: "var(--text-secondary)", fontSize: "14.5px", marginTop: "4px" }}>
            Explore curated decks and structured language learning roadmaps.
          </p>
        </div>

        {isLinguist && (
          <button
            type="button"
            className="btn-primary"
            onClick={() => navigate("/decks/create")}
          >
            + Create New Deck
          </button>
        )}
      </div>

      {/* Search Bar */}
      <div style={{ position: "relative", marginBottom: "24px" }}>
        <input
          type="text"
          placeholder="Search decks..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ maxWidth: "440px" }}
        />
      </div>

      {message && (
        <p role="status" className="alert-success">
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

      {/* Deck Grid or Empty State */}
      {!error && filteredDecks.length === 0 ? (
        <div className="empty-state-card">
          <div className="empty-state-icon">📚</div>
          <p className="empty-state-title" style={{ fontSize: "18px", fontWeight: "700" }}>
            No Decks Found
          </p>
          <p className="empty-state-desc">
            You don't have any learning roadmaps matching your search.
          </p>

          {isLinguist && (
            <button
              type="button"
              className="btn-primary"
              onClick={() => navigate("/decks/create")}
            >
              Create Your First Deck
            </button>
          )}
        </div>
      ) : (
        <div className="deck-grid">
          {filteredDecks.map((deck) => (
            <div key={deck.id} className="deck-card">
              <div>
                <div className="deck-card-header">
                  <h3 className="deck-title" style={{ fontSize: "17px" }}>
                    {deck.title || deck.name}
                  </h3>
                  <span className="deck-tag">
                    {deck.languageTrack?.name || "Vocabulary"}
                  </span>
                </div>

                <p style={{ fontSize: "13.5px", color: "var(--text-secondary)", marginBottom: "16px", minHeight: "38px" }}>
                  {deck.description || "Master vocabulary through spaced repetition cards."}
                </p>

                <div style={{ display: "flex", gap: "12px", fontSize: "12px", color: "var(--text-muted)" }}>
                  <span>🗂️ {deck.flashcards ? deck.flashcards.length : 0} cards</span>
                  {deck.isPublic !== undefined && (
                    <span>{deck.isPublic ? "🌐 Public" : "🔒 Private"}</span>
                  )}
                </div>
              </div>

              <div className="deck-actions">
                <Link
                  to={`/study/${deck.id}`}
                  className="btn-primary"
                  style={{ textDecoration: "none", fontSize: "13px", padding: "7px 14px" }}
                >
                  Study
                </Link>

                <Link
                  to={`/decks/${deck.id}`}
                  className="btn-secondary"
                  style={{ textDecoration: "none", fontSize: "13px", padding: "7px 14px" }}
                >
                  Open
                </Link>

                {isLinguist && (
                  <>
                    <button
                      type="button"
                      className="btn-secondary"
                      onClick={() => handleEdit(deck)}
                      style={{ padding: "7px 12px" }}
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      className="btn-danger"
                      onClick={() => handleDelete(deck.id)}
                      style={{ padding: "7px 12px" }}
                    >
                      Delete
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default DeckList;