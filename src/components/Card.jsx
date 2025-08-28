"use client"

import { useState } from "react"

/**
 * Card Component
 * Renders a clickable memory card with an image.
 * Handles image loading errors and supports keyboard accessibility.
 */
export default function Card({ image, onClick }) {
  const [imageError, setImageError] = useState(false)

  // Handles when a user clicks the card
  const handleClick = () => {
    onClick(image)
  }

  // Allows triggering with Enter or Space key for accessibility
  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault()
      handleClick()
    }
  }

  return (
    <div
      className="card"
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      tabIndex={0} // Makes the card focusable
      role="button"
      aria-label={`Memory card: ${image.alt}`}
    >
      {imageError ? (
        <div className="card-error">Image failed to load</div>
      ) : (
        <img
          src={image.url || "/placeholder.svg"} // fallback if no image.url
          alt={image.alt}
          onError={() => setImageError(true)} // if image fails, show error
          loading="lazy" // improves performance by lazy-loading
        />
      )}
    </div>
  )
}
