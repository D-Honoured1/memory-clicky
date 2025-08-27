// src/components/Controls.jsx
import React from "react";

/**
 * Controls component for game actions like Reset Round and Toggle AutoShuffle for hard mode.
 */
export default function Controls({ onReset, autoShuffle, setAutoShuffle }) {
  return (
    <div className="controls app-card" role="toolbar" aria-label="Game controls">
      <button onClick={onReset} className="btn secondary" aria-label="Reset round">Reset Round</button>
      <label style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <input
          type="checkbox"
          checked={autoShuffle}
          onChange={(e) => setAutoShuffle(e.target.checked)}
          aria-label="Toggle auto shuffle"
        />
        <span className="small-muted">Auto-shuffle (Hard)</span>
      </label>
    </div>
  );
}
