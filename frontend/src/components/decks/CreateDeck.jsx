import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import api from "../../services/api";

function CreateDeck() {
  const user = useSelector((state) => state.auth?.user);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [capacity, setCapacity] = useState(50);
  const [isPublic, setIsPublic] = useState(false);
  const [languageTrack, setLanguageTrack] = useState("");
  const [languages, setLanguages] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const loadLanguages = async () => {
      try {
        const response = await api.get("/languages");

        if (Array.isArray(response?.data)) {
          setLanguages(response.data);
        }
      } catch (err) {
        setLanguages([]);
      }
    };

    loadLanguages();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");
    setLoading(true);

    try {
      await api.post("/decks", {
        title: title.trim(),
        description: description.trim() || "Vocabulary learning roadmap",
        capacity: Number(capacity) || 50,
        mentorName: user?.username || "Instructor",
        isPublic,
        languageTrackId: Number(languageTrack) || 1,
      });

      setSuccess("Deck created successfully");
      setTimeout(() => {
        navigate("/decks");
      }, 700);
    } catch (err) {
      setError(
        err?.response?.data?.message || "Failed to create deck"
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
          <span>ROADMAP BUILDER</span>
        </div>
        <h2 style={{ fontSize: "30px", fontWeight: "800", color: "var(--text-primary)", letterSpacing: "-0.8px" }}>
          Create New Deck
        </h2>
        <p style={{ color: "var(--text-secondary)", fontSize: "14px", marginTop: "4px" }}>
          Create a structured learning roadmap for your language learners.
        </p>
      </div>

      <div className="saas-card">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="deck-title">Deck Title</label>
            <input
              id="deck-title"
              type="text"
              placeholder="e.g. Spanish Vocabulary Master"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="deck-description">Description</label>
            <textarea
              id="deck-description"
              rows={3}
              placeholder="Describe what learners will achieve with this deck"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="deck-capacity">Capacity</label>
            <input
              id="deck-capacity"
              type="number"
              min="1"
              placeholder="50"
              value={capacity}
              onChange={(e) => setCapacity(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="language-track">Language Track</label>
            <select
              id="language-track"
              value={languageTrack}
              onChange={(e) => setLanguageTrack(e.target.value)}
              required
            >
              <option value="">Select Language</option>
              {languages.map((language) => (
                <option key={language.id || language} value={language.id || language}>
                  {language.name || language}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group" style={{ marginTop: "10px", marginBottom: "24px" }}>
            <label htmlFor="public-deck" className="checkbox-row">
              <input
                id="public-deck"
                type="checkbox"
                checked={isPublic}
                onChange={(e) => setIsPublic(e.target.checked)}
              />
              <span>Make this deck public</span>
            </label>
          </div>

          {error && <div role="alert" className="alert-error">{error}</div>}
          {success && <div role="alert" className="alert-success">{success}</div>}

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
              {loading ? "Creating..." : "Create Deck"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateDeck;