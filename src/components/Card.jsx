// src/components/Card.jsx
import React from "react";

/**
 * Card component - focusable and keyboard-activatable.
 * Props:
 *  - item: { id, name, image }
 *  - onClick: function to call when activated
 */
export default function Card({ item, onClick }) {
  return (
    <div
      onClick={() => onClick(item)}
      className="bg-white rounded-xl shadow p-2 cursor-pointer hover:scale-105 transition"
    >
    <img
      src={item.urls.small}
      alt={item.alt_description || "Unsplash image"}
      loading="lazy"
    />

    </div>
  );
}


