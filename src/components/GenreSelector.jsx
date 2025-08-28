"use client"

import { AVAILABLE_GENRES } from "../hooks/useFetchImages"

/**
 * GenreSelector component: allows users to select image genre/category
 */
export default function GenreSelector({ selectedGenre, onGenreChange }) {
  return (
    <div className="genre-selector app-card">
      <div className="genre-header">
        <h3>Image Category</h3>
        <div className="small-muted">Choose what type of images to use</div>
      </div>

      <div className="genre-grid">
        {AVAILABLE_GENRES.map((genre) => (
          <button
            key={genre}
            className={`btn genre-btn ${selectedGenre === genre ? "primary" : "secondary"}`}
            onClick={() => onGenreChange(genre)}
            aria-label={`Select ${genre} category`}
          >
            {genre.charAt(0).toUpperCase() + genre.slice(1)}
          </button>
        ))}
      </div>
    </div>
  )
}
