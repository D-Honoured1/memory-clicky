// src/components/Scoreboard.jsx
import React from "react";

/**
 * Scoreboard shows current score, best score and optionally timer.
 * Accessible and lightweight.
 */
export default function Scoreboard({ currentScore, bestScore, timeLeft }) {
  return (
    <div className="scoreboard app-card" role="region" aria-label="Scoreboard">
      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
        <div>
          <div className="small-muted">Score</div>
          <div style={{ fontWeight: 700, fontSize: 20 }}>{currentScore}</div>
        </div>

        <div>
          <div className="small-muted">Best</div>
          <div className="badge mono">{bestScore}</div>
        </div>
      </div>

      <div style={{ marginLeft: "auto", display: "flex", gap: 12, alignItems: "center" }}>
        {typeof timeLeft === "number" && (
          <div className="timer" aria-live="polite" title="Time left for this click">
            ⏱ {timeLeft}s
          </div>
        )}
      </div>
    </div>
  );
}
