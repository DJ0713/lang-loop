import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import deckService from "../services/deckService";

function DeckForm({ deck = null, editMode = false }) {
  const { id } = useParams();
  const [currentDeck, setCurrentDeck] = useState(deck);

  const [title, setTitle] = useState(
    deck?.title || deck?.name || ""
  );

  const [isPublic, setIsPublic] = useState(
    deck?.isPublic ?? deck?.public ?? false
  );

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const titleRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (editMode && titleRef.current) {
      titleRef.current.focus();
    }
  }, [editMode]);

  useEffect(() => {
    if (deck) {
      setCurrentDeck(deck);
      setTitle(deck.title || deck.name || "");
      setIsPublic(deck.isPublic ?? deck.public ?? false);
    } else if (editMode && id) {
      deckService.getDeckById(id)
        .then((data) => {
          if (data) {
            setCurrentDeck(data);
            setTitle(data.title || data.name || "");
            setIsPublic(data.isPublic ?? data.public ?? false);
          }
        })
        .catch(() => {});
    }
  }, [deck, editMode, id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setMessage("");

    if (!title.trim()) {
      setError("Title is required");
      return;
    }

    const deckData = {
      title: title.trim(),
      name: title.trim(),
      description: currentDeck?.description || "",
      capacity: currentDeck?.capacity || 50,
      mentorName: currentDeck?.mentorName || "Instructor",
      isPublic,
    };

    setLoading(true);

    try {
      const targetId = currentDeck?.id || id;
      if (editMode && targetId) {
        await deckService.updateDeck(targetId, deckData);
        setMessage("Deck updated successfully");
        setTimeout(() => navigate("/decks"), 700);
      } else {
        await deckService.createDeck(deckData);
        setMessage("Deck created successfully");
        setTitle("");
        setIsPublic(false);
        setTimeout(() => navigate("/decks"), 700);
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to save deck"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "620px", margin: "0 auto" }}>
      <div style={{ marginBottom: "28px" }}>
        <Link to="/decks" style={{ color: "var(--accent-cyan)", textDecoration: "none", fontSize: "13px", fontFamily: "var(--font-mono)", display: "inline-flex", alignItems: "center", gap: "6px" }}>
          ← Back to Roadmaps
        </Link>
        <div className="eyebrow-text" style={{ marginTop: "12px", marginBottom: "4px" }}>
          <span>ROADMAP CONFIGURATION</span>
        </div>
        <h2 style={{ fontSize: "30px", fontWeight: "800", color: "var(--text-primary)", letterSpacing: "-0.8px" }}>
          {editMode ? "Edit Deck" : "Create Deck"}
        </h2>
        <p style={{ color: "var(--text-secondary)", fontSize: "14px", marginTop: "4px" }}>
          {editMode ? "Update learning roadmap properties and permissions." : "Create a new language learning study deck."}
        </p>
      </div>

      <div className="saas-card">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">Title</label>
            <input
              ref={titleRef}
              id="title"
              name="title"
              type="text"
              placeholder="Enter deck title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="form-group" style={{ marginTop: "10px", marginBottom: "24px" }}>
            <label htmlFor="public" className="checkbox-row">
              <input
                id="public"
                name="public"
                type="checkbox"
                checked={isPublic}
                onChange={(e) => setIsPublic(e.target.checked)}
              />
              <span>Public</span>
            </label>
          </div>

          {error && <p role="alert" className="alert-error">{error}</p>}
          {message && <p role="status" className="alert-success">{message}</p>}

          <div style={{ display: "flex", gap: "12px", marginTop: "12px" }}>
            <button
              type="button"
              className="btn-secondary"
              onClick={() => navigate("/decks")}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary"
              disabled={loading}
            >
              {loading ? "Saving..." : (editMode ? "Update Deck" : "Create Deck")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default DeckForm;