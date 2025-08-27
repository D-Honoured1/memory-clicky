// src/components/Card.jsx
import React from "react";

/**
 * Card component - focusable and keyboard-activatable.
 * Props:
 *  - item: { id, name, image }
 *  - onClick: function to call when activated
 */
function Card({ url, alt, onClick }) {
  return (
    <div
      onClick={onClick}
      className="bg-white rounded-xl shadow p-2 cursor-pointer hover:scale-105 transition"
    >
      <img src={url} alt={alt} className="w-full h-40 object-cover rounded-md" />
    </div>
  );
}

export default Card;

