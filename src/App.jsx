// src/App.jsx
import React, { useEffect, useMemo, useState } from "react";
import Header from "./components/Header";
import Scoreboard from "./components/Scoreboard";
import StageSelector from "./components/StageSelector";
import CardGrid from "./components/CardGrid";
import Controls from "./components/Controls";
import useFetchImages from "./hooks/useFetchImages";
import "./index.css";

// optional confetti
let confetti = null;
try {
  // lazy require so app still runs if package not installed
  // eslint-disable-next-line import/no-extraneous-dependencies
  confetti = require("canvas-confetti");
} catch (e) {
  confetti = null;
}

/**
 * App component orchestrates:
 *  - stage selection
 *  - score state (currentScore, bestScore) with localStorage persistence for bestScore
 *  - fetching images appropriate to stage
 *  - reset logic and passing handlers to CardGrid
 *  - theme management persisted in localStorage
 */
export default function App() {
  // theme persisted in localStorage
  const [theme, setTheme] = useState(() => {
    const t = localStorage.getItem("mc_theme");
    return t || "light";
  });
  useEffect(() => {
    localStorage.setItem("mc_theme", theme);
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  // stage state
  const [stage, setStage] = useState(1);

  // map stage to requested N images
  const imagesNeeded = useMemo(() => (stage === 1 ? 6 : stage === 2 ? 12 : 18), [stage]);

  // fetch images with hook
  const { images, loading, error } = useFetchImages("nature",imagesNeeded);

  // scoring
  const [currentScore, setCurrentScore] = useState(0);
  const [bestScore, setBestScore] = useState(() => {
    const saved = localStorage.getItem("mc_best");
    return saved ? Number(saved) : 0;
  });

  // timer display from CardGrid
  const [timeLeft, setTimeLeft] = useState(null);

  // resetSignal increments to signal CardGrid to reset
  const [resetSignal, setResetSignal] = useState(0);

  // toggle for hard-mode auto-shuffle
  const [autoShuffle, setAutoShuffle] = useState(true);

  // If stage changes, reset the round and scores (but keep bestScore)
  useEffect(() => {
    setCurrentScore(0);
    setResetSignal((s) => s + 1);
  }, [stage]);

  // Handler when user gets a point
  const handleScore = (delta = 1) => {
    setCurrentScore((prev) => {
      const next = prev + delta;
      // immediate bestScore update if higher
      setBestScore((b) => {
        if (next > b) {
          localStorage.setItem("mc_best", String(next));
          // confetti if available
          if (confetti && typeof confetti.default === "function") {
            confetti.default({ particleCount: 60, spread: 60, origin: { y: 0.4 } });
          }
          return next;
        }
        return b;
      });
      return next;
    });
  };

  // Handler when user loses (click repeated or timer expired)
  const handleLose = () => {
    // update bestScore already handled in handleScore, but ensure persisted
    if (currentScore > bestScore) {
      localStorage.setItem("mc_best", String(currentScore));
      setBestScore(currentScore);
    }
    setCurrentScore(0);
    setResetSignal((s) => s + 1);
  };

  // manual reset
  const resetRound = () => {
    setCurrentScore(0);
    setResetSignal((s) => s + 1);
    setTimeLeft(null);
  };

  return (
    <div className="app">
      <Header theme={theme} setTheme={setTheme} />

      <div style={{ display: "grid", gap: 12 }}>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <Scoreboard currentScore={currentScore} bestScore={bestScore} timeLeft={timeLeft} />
          <StageSelector stage={stage} setStage={setStage} />
          <div style={{ marginLeft: "auto" }} className="small-muted">
            {loading ? "Loading images..." : error ? "Image load error" : `Showing ${imagesNeeded} cards`}
          </div>
        </div>

        <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
          <Controls onReset={resetRound} autoShuffle={autoShuffle} setAutoShuffle={setAutoShuffle} />
          <div style={{ marginLeft: "auto" }}>
            <button
              className="btn"
              onClick={() => {
                // quick debug: clear storage
                localStorage.removeItem("mc_best");
                setBestScore(0);
              }}
              aria-label="Clear best score"
            >
              Clear Best
            </button>
          </div>
        </div>

        <div className="app-card">
          <CardGrid
            images={images}
            stage={stage}
            onScore={handleScore}
            onLose={handleLose}
            resetSignal={resetSignal}
            setTimeLeft={setTimeLeft}
            autoShuffleEnabled={autoShuffle}
          />
        </div>
      </div>
    </div>
  );
}
