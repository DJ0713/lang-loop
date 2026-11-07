import React, { useEffect, useState, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../../services/api";

function DeckDetails({ deck: providedDeck }) {
  const { id } = useParams();

  const [deck, setDeck] = useState(providedDeck || null);
  const [cards, setCards] = useState([]);
  const [frontText, setFrontText] = useState("");
  const [backText, setBackText] = useState("");

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchCards = useCallback(async (deckId) => {
    try {
      const res = await api.get(`/decks/${deckId}/cards`);
      if (Array.isArray(res.data)) {
        setCards(res.data);
      }
    } catch (e) {
      // ignore
    }
  }, []);

  useEffect(() => {
    if (providedDeck) {
      setDeck(providedDeck);
      if (providedDeck.flashcards) {
        setCards(providedDeck.flashcards);
      }
      return;
    }

    if (!id) {
      return;
    }

    api
      .get(`/decks/${id}`)
      .then((response) => {
        setDeck(response.data);
        if (response.data?.flashcards) {
          setCards(response.data.flashcards);
        } else {
          fetchCards(id);
        }
      })
      .catch((err) => {
        setError(
          err.response?.data?.message ||
            "Failed to load deck details"
        );
      });
  }, [id, providedDeck, fetchCards]);

  const handleAddCard = async () => {
    setError("");
    setMessage("");

    if (!frontText.trim() || !backText.trim()) {
      setError("Front and back text are required");
      return;
    }

    setLoading(true);

    try {
      const payload = {
        frontText: frontText.trim(),
        backText: backText.trim(),
        frontContent: frontText.trim(),
        backContent: backText.trim(),
      };

      const res = await api.post(`/decks/${id}/cards`, payload);

      setMessage("Card added successfully");
      if (res?.data) {
        setCards((prev) => [...prev, res.data]);
      } else {
        setCards((prev) => [
          ...prev,
          { id: Date.now(), frontText: frontText.trim(), backText: backText.trim() }
        ]);
      }

      setFrontText("");
      setBackText("");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to add card"
      );
    } finally {
      setLoading(false);
    }
  };

  if (error && !deck) {
    return (
      <div style={{ maxWidth: "700px", margin: "0 auto" }}>
        <p role="alert" className="alert-error">{error}</p>
        <Link to="/decks" className="btn-secondary" style={{ textDecoration: "none", marginTop: "12px" }}>
          ← Back to Roadmaps
        </Link>
      </div>
    );
  }

  const displayedCards = cards.length > 0 ? cards : (deck?.flashcards || []);

  return (
    <div>
      {/* Header & Meta */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "16px", marginBottom: "28px" }}>
        <div>
          <Link to="/decks" style={{ color: "var(--accent-cyan)", textDecoration: "none", fontSize: "13px", fontFamily: "var(--font-mono)", display: "inline-flex", alignItems: "center", gap: "6px" }}>
            ← Back to Roadmaps
          </Link>
          <div className="eyebrow-text" style={{ marginTop: "10px", marginBottom: "4px" }}>
            <span>ROADMAP OVERVIEW</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginTop: "4px" }}>
            <h2 style={{ fontSize: "30px", fontWeight: "800", color: "var(--text-primary)", letterSpacing: "-0.8px" }}>
              {deck?.title || deck?.name || "Deck Details"}
            </h2>
            {deck?.languageTrack?.name && (
              <span className="deck-tag">{deck.languageTrack.name}</span>
            )}
          </div>
          <p style={{ color: "var(--text-secondary)", fontSize: "14.5px", marginTop: "6px" }}>
            {deck?.description || "Curated vocabulary flashcards with spaced repetition tracking."}
          </p>
        </div>

        <Link
          to={`/study/${id || deck?.id}`}
          className="btn-primary"
          style={{ textDecoration: "none", padding: "10px 20px" }}
        >
          ⚡ Start Study Session
        </Link>
      </div>

      {error && <p role="alert" className="alert-error">{error}</p>}
      {message && <p role="status" className="alert-success">{message}</p>}

      {/* Add New Card Section */}
      <div className="saas-card" style={{ marginBottom: "32px" }}>
        <h3 style={{ fontSize: "16px", fontWeight: "700", color: "var(--text-primary)", marginBottom: "16px" }}>
          Add New Flashcard
        </h3>
        
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr auto", gap: "14px", alignItems: "center" }}>
          <input
            type="text"
            placeholder="e.g., Hello"
            value={frontText}
            onChange={(e) => setFrontText(e.target.value)}
          />

          <input
            type="text"
            placeholder="e.g., Hola"
            value={backText}
            onChange={(e) => setBackText(e.target.value)}
          />

          <button
            type="button"
            className="btn-primary"
            onClick={handleAddCard}
            disabled={loading}
            style={{ whiteSpace: "nowrap" }}
          >
            + Add to Deck
          </button>
        </div>
      </div>

      {/* Flashcards List */}
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
          <h3 style={{ fontSize: "18px", fontWeight: "700", color: "var(--text-primary)" }}>
            Flashcards ({displayedCards.length})
          </h3>
        </div>

        {displayedCards.length > 0 ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "16px" }}>
            {displayedCards.map((card, index) => (
              <div key={card.id || index} className="saas-card saas-card-hover" style={{ padding: "20px" }}>
                <div style={{ fontSize: "11px", fontWeight: "700", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "8px" }}>
                  Card #{index + 1}
                </div>
                <div style={{ marginBottom: "12px" }}>
                  <span style={{ fontSize: "11px", color: "var(--primary-light)", fontWeight: "600" }}>Question:</span>
                  <p style={{ fontSize: "15px", fontWeight: "600", color: "var(--text-primary)", marginTop: "2px" }}>
                    {card.question || card.frontText || card.frontContent}
                  </p>
                </div>
                <div style={{ borderTop: "1px solid var(--border-subtle)", paddingTop: "10px" }}>
                  <span style={{ fontSize: "11px", color: "var(--success)", fontWeight: "600" }}>Answer:</span>
                  <p style={{ fontSize: "14px", color: "var(--text-secondary)", marginTop: "2px" }}>
                    {card.answer || card.backText || card.backContent}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state-card">
            <div className="empty-state-icon">🗂️</div>
            <p className="empty-state-title">No Flashcards Found</p>
            <p className="empty-state-desc">This deck has no flashcards yet. Add your first card above.</p>
          </div>
        )}
      </div>

      {/* Roadmap Milestones (if any) */}
      {deck?.milestones?.length > 0 && (
        <div style={{ marginTop: "36px" }}>
          <h3 style={{ fontSize: "18px", fontWeight: "700", color: "var(--text-primary)", marginBottom: "16px" }}>
            Roadmap Milestones
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {deck.milestones.map((milestone) => (
              <div key={milestone.id} className="saas-card" style={{ padding: "16px 20px" }}>
                <p style={{ fontWeight: "600", color: "var(--text-primary)" }}>{milestone.title}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default DeckDetails;