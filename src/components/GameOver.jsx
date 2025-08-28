export default function GameOver({ currentScore, bestScore, onRetry }) {
  return (
    <div className="game-over-overlay">
      <div className="game-over-card">
        <h1 className="game-over-title">🎮 Game Over</h1>

        <div className="score-summary">
          <p>Your Score: <strong>{currentScore}</strong></p>
          <p>Best Score: <strong>{bestScore}</strong></p>
        </div>

        <div className="game-over-actions">
          <button className="btn primary" onClick={onRetry}>
            🔄 Play Again
          </button>
        </div>
      </div>
    </div>
  )
}
