"use client"

import { useState } from "react"

export default function Card({ image, onClick }) {
  const [imageError, setImageError] = useState(false)

  const handleClick = () => {
    onClick(image.id)
  }

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
      tabIndex={0}
      role="button"
      aria-label={`Memory card: ${image.alt}`}
    >
      {imageError ? (
        <div className="card-error">Image failed to load</div>
      ) : (
        <img src={image.url || "/placeholder.svg"} alt={image.alt} onError={() => setImageError(true)} loading="lazy" />
      )}
    </div>
  )
}
