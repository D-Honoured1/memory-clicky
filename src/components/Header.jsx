"use client"

/**
 * Header component: shows title, theme toggle (passed in), and small caption.
 * All buttons must have aria-label for accessibility.
 */
export default function Header({ theme, setTheme }) {
  const toggle = () => setTheme(theme === "dark" ? "light" : "dark")

  return (
    <header className="header app-card" role="banner" aria-label="Game header">
      <div className="title">
        <div style={{ display: "grid" }}>
          <div style={{ fontSize: 18, fontWeight: 700 }}>Memory Clicky</div>
          <div className="small-muted" style={{ marginTop: 2 }}>
            Test your memory — don't click the same card twice!
          </div>
        </div>
      </div>

      <div className="row">
        <button className="btn secondary" onClick={toggle} aria-label="Toggle light dark theme" title="Toggle theme">
          {theme === "dark" ? "Light" : "Dark"}
        </button>
      </div>
    </header>
  )
}
