"use client"

import { useState } from "react"
import Menu from "./Menu"

/**
 * Header component: shows title, menu button, and theme toggle.
 * All buttons must have aria-label for accessibility.
 */
export default function Header({ theme, setTheme, onRestart, stage, setStage, genre, setGenre }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggle = () => setTheme(theme === "dark" ? "light" : "dark")

  return (
    <>
      <header className="header app-card" role="banner" aria-label="Game header">
        <div className="title">
          <div style={{ display: "grid" }}>
            <div style={{ fontSize: 18, fontWeight: 700 }}>Memory Clicky</div>
            <div className="small-muted" style={{ marginTop: 2 }}>
              Click each card only once to score points. Click a card twice and you lose!
            </div>
          </div>
        </div>

        <div className="row">
          <button className="btn primary" onClick={() => setIsMenuOpen(true)} aria-label="Open game menu" title="Menu">
            Menu
          </button>
          <button className="btn secondary" onClick={toggle} aria-label="Toggle light dark theme" title="Toggle theme">
            {theme === "dark" ? "Light" : "Dark"}
          </button>
        </div>
      </header>

      <Menu
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        onRestart={onRestart}
        theme={theme}
        setTheme={setTheme}
        stage={stage}
        setStage={setStage}
        genre={genre}
        setGenre={setGenre}
      />
    </>
  )
}
