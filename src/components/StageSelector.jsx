// src/components/StageSelector.jsx
import React from "react";

/**
 * StageSelector: choose difficulty stage (1,2,3)
 * Controlled component - reports selection via onChange.
 */
export default function StageSelector({ stage, setStage }) {
  return (
    <div className="controls">
      <div className="small-muted">Stage</div>
      <div style={{ display: "flex", gap: 8 }}>
        <button
          aria-label="Select Easy stage"
          onClick={() => setStage(1)}
          className={`btn ${stage === 1 ? "" : "secondary"}`}
        >
          Easy
        </button>
        <button
          aria-label="Select Medium stage"
          onClick={() => setStage(2)}
          className={`btn ${stage === 2 ? "" : "secondary"}`}
        >
          Medium
        </button>
        <button
          aria-label="Select Hard stage"
          onClick={() => setStage(3)}
          className={`btn ${stage === 3 ? "" : "secondary"}`}
        >
          Hard
        </button>
      </div>
      <div style={{ marginLeft: 12 }} className="small-muted">
        <div>Easy: 6 cards</div>
        <div>Medium: 12 cards, 7s per-click</div>
        <div>Hard: 18 cards, 5s per-click + optional auto-shuffle</div>
      </div>
    </div>
  );
}
