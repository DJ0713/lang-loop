import React, { useEffect, useState, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import api from "../../services/api";

function StudyMode({ flashcards: initialFlashcards }) {
  const { deckId } = useParams();
  const user = useSelector((state) => state.auth?.user);

  const [flashcards, setFlashcards] = useState(
    initialFlashcards || []
  );
  const [deckInfo, setDeckInfo] = useState(null);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [score, setScore] = useState(0);
  const [error, setError] = useState("");
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    if (
      initialFlashcards &&
      initialFlashcards.length > 0
    ) {
      setFlashcards(initialFlashcards);
      return;
    }

    if (!deckId) {
      return;
    }

    // Fetch deck details for track title
    api.get(`/decks/${deckId}`)
      .then((res) => {
        if (res.data) setDeckInfo(res.data);
      })
      .catch(() => {});

    api
      .get(`/decks/${deckId}/cards`)
      .then((response) => {
        const data = Array.isArray(response.data)
          ? response.data
          : [];

        setFlashcards(data);
      })
      .catch((err) => {
        setError(
          err.response?.data?.message ||
            "Failed to load study cards"
        );
      });
  }, [deckId, initialFlashcards]);

  const handleScore = useCallback((correct) => {
    const activeItem = flashcards[currentIndex];
    const currentCardObj = activeItem?.card || activeItem;
    const cardId = currentCardObj?.id;

    if (cardId) {
      api.post("/study/card-review", {
        cardId,
        deckId: Number(deckId) || currentCardObj?.deck?.id,
        correct,
      }).catch(() => {});
    }

    let nextScore = score;
    if (correct) {
      nextScore = score + 1;
      setScore((previous) => previous + 1);
    }

    setShowAnswer(false);

    if (currentIndex < flashcards.length - 1) {
      setCurrentIndex((previous) => previous + 1);
    } else {
      setCompleted(true);
      const userId = user?.id || user?.userId;
      if (userId && deckId) {
        api.post("/study/complete", {
          userId,
          deckId: Number(deckId),
          score: nextScore,
        }).catch(() => {});
      }
    }
  }, [currentIndex, flashcards, deckId, score, user]);

  // Keyboard shortcut listener (Space to reveal, 1/2 for Again/Correct)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === "Space") {
        e.preventDefault();
        setShowAnswer((prev) => !prev);
      } else if (showAnswer) {
        if (e.key === "1" || e.key === "ArrowLeft") {
          handleScore(false);
        } else if (e.key === "2" || e.key === "ArrowRight") {
          handleScore(true);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [showAnswer, handleScore]);

  if (error) {
    return (
      <div style={{ maxWidth: "600px", margin: "40px auto" }}>
        <p role="alert" className="alert-error">{error}</p>
        <Link to="/decks" className="btn-secondary" style={{ textDecoration: "none", marginTop: "12px" }}>
          ← Exit study
        </Link>
      </div>
    );
  }

  if (flashcards.length === 0) {
    return (
      <div className="empty-state-card" style={{ maxWidth: "600px", margin: "40px auto" }}>
        <div className="empty-state-icon">📭</div>
        <p className="empty-state-title">No Flashcards Found</p>
        <p className="empty-state-desc">This deck doesn't have any flashcards to practice yet.</p>
        <Link to="/decks" className="btn-primary" style={{ textDecoration: "none" }}>
          ← Return to Roadmaps
        </Link>
      </div>
    );
  }

  // Session Completed State
  if (completed) {
    const accuracy = Math.round((score / flashcards.length) * 100);

    return (
      <div className="study-viewport" style={{ textAlign: "center", paddingTop: "40px" }}>
        <div className="saas-card" style={{ padding: "52px 36px", border: "1px solid rgba(0, 229, 255, 0.4)", boxShadow: "0 25px 65px rgba(0, 0, 0, 0.8), 0 0 35px rgba(0, 229, 255, 0.2)" }}>
          <div className="eyebrow-text" style={{ marginBottom: "16px" }}>
            <span>SESSION MILESTONE ACHIEVED</span>
          </div>
          <div style={{ fontSize: "56px", marginBottom: "16px", filter: "drop-shadow(0 0 20px rgba(255, 209, 90, 0.5))" }}>⚡</div>
          <h2 style={{ fontSize: "36px", fontWeight: "900", color: "var(--text-primary)", letterSpacing: "-0.8px", marginBottom: "8px" }}>
            Session Complete!
          </h2>
          <p style={{ color: "var(--text-secondary)", fontSize: "15px", marginBottom: "32px", maxWidth: "440px", margin: "0 auto 32px" }}>
            Excellent recall cycle. Every repetition strengthens long-term neural retention.
          </p>

          <div style={{ display: "flex", justifyContent: "center", gap: "40px", marginBottom: "36px", background: "rgba(7, 16, 32, 0.6)", padding: "20px", borderRadius: "var(--radius-md)", border: "1px solid var(--border-subtle)" }}>
            <div>
              <div style={{ fontSize: "36px", fontWeight: "800", color: "var(--accent-cyan)", fontFamily: "var(--font-mono)" }}>
                {score} / {flashcards.length}
              </div>
              <div style={{ fontSize: "11px", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "1px", fontFamily: "var(--font-mono)", marginTop: "4px" }}>
                Score
              </div>
            </div>
            <div style={{ width: "1px", background: "var(--border-subtle)" }} />
            <div>
              <div style={{ fontSize: "36px", fontWeight: "800", color: accuracy >= 80 ? "var(--success)" : "var(--accent-gold)", fontFamily: "var(--font-mono)" }}>
                {accuracy}%
              </div>
              <div style={{ fontSize: "11px", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "1px", fontFamily: "var(--font-mono)", marginTop: "4px" }}>
                Accuracy
              </div>
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "center", gap: "14px" }}>
            <button
              type="button"
              className="btn-secondary"
              onClick={() => {
                setCurrentIndex(0);
                setScore(0);
                setShowAnswer(false);
                setCompleted(false);
              }}
            >
              Practice Again
            </button>

            <Link to="/decks" className="btn-primary" style={{ textDecoration: "none" }}>
              Back to Roadmaps
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const currentCard = flashcards[currentIndex];
  const card = currentCard?.card || currentCard;
  const progressPercent = Math.round(((currentIndex + 1) / flashcards.length) * 100);
  const deckTitle = deckInfo?.title || card?.deck?.title || "Language Practice";
  const languageTrack = deckInfo?.languageTrack?.name || "Vocabulary";

  return (
    <div className="study-viewport">
      {/* Top Bar: Exit + Deck Tag */}
      <div className="study-top-bar">
        <Link
          to="/decks"
          style={{
            color: "var(--accent-cyan)",
            textDecoration: "none",
            fontSize: "13px",
            fontWeight: "600",
            fontFamily: "var(--font-mono)",
            display: "flex",
            alignItems: "center",
            gap: "6px"
          }}
        >
          <span>←</span> Exit study
        </Link>

        <span className="deck-tag" style={{ fontSize: "11px", padding: "6px 14px", border: "1px solid rgba(0, 229, 255, 0.4)", background: "rgba(8, 108, 255, 0.2)" }}>
          ⚡ {deckTitle} ({languageTrack})
        </span>
      </div>

      {/* Progress & Counter */}
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
          <div>
            <h2 style={{ fontSize: "22px", fontWeight: "800", color: "var(--text-primary)", letterSpacing: "-0.4px", display: "inline-block", marginRight: "12px" }}>
              Study Mode
            </h2>
            <span style={{ fontSize: "13px", color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>
              Active Spaced Repetition
            </span>
          </div>

          <span style={{ fontSize: "13px", fontWeight: "700", color: "var(--accent-cyan)", fontFamily: "var(--font-mono)" }}>
            Card {currentIndex + 1} of {flashcards.length}
          </span>
        </div>

        <div className="progress-track">
          <div
            className="progress-fill"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Central Study Card */}
      <div
        className="study-card-box"
        onClick={() => setShowAnswer(!showAnswer)}
        title="Tap to reveal answer"
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter") setShowAnswer(!showAnswer);
        }}
      >
        <div className="study-sub-badge">
          {showAnswer ? "SOLUTION" : "TRANSLATE THIS"}
        </div>

        <div className="study-prompt-text">
          {card?.frontText || card?.frontContent || card?.question || ""}
        </div>

        {showAnswer && (
          <div style={{ marginTop: "16px", animation: "fadeIn 200ms ease" }}>
            <div style={{ fontSize: "12px", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "6px" }}>
              Answer
            </div>
            <div className="study-answer-text">
              {card?.backText || card?.backContent || card?.answer || ""}
            </div>
          </div>
        )}

        <div className="study-hint">
          {!showAnswer
            ? "Tap the card or press Space to reveal the answer"
            : "Rate your recall below to adjust repetition intervals"}
        </div>
      </div>

      {/* Bottom Action Controls */}
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "16px" }}>
        {!showAnswer ? (
          <button
            type="button"
            className="btn-primary"
            onClick={() => setShowAnswer(true)}
            style={{ padding: "12px 32px", fontSize: "15px" }}
          >
            Show Answer
          </button>
        ) : (
          <div style={{ display: "flex", gap: "16px", width: "100%", maxWidth: "420px" }}>
            <button
              type="button"
              className="btn-secondary"
              onClick={() => handleScore(false)}
              style={{ flex: 1, padding: "12px 20px", fontSize: "14px", fontWeight: "600" }}
            >
              Again (Incorrect)
            </button>

            <button
              type="button"
              className="btn-primary"
              onClick={() => handleScore(true)}
              style={{ flex: 1, padding: "12px 20px", fontSize: "14px", fontWeight: "600" }}
            >
              ✓ Got it (Correct)
            </button>
          </div>
        )}
      </div>

      {/* Sub Score & Info */}
      <div style={{ display: "flex", justifyContent: "space-between", color: "var(--text-muted)", fontSize: "12px", padding: "0 8px" }}>
        <p>Score: {score}</p>
        <p>Shortcuts: [Space] Flip • [1] Again • [2] Got it</p>
      </div>
    </div>
  );
}

export default StudyMode;