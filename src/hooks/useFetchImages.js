"use client"

import { useState, useEffect } from "react"

// Base Unsplash API endpoint for random photos
const UNSPLASH_API_URL = "https://api.unsplash.com/photos/random"

const GENRE_SEARCH_TERMS = {
  nature: "nature,landscape,forest,mountain,ocean",
  animals: "animals,pets,wildlife,cats,dogs",
  food: "food,cooking,restaurant,cuisine,meal",
  travel: "travel,city,architecture,landmark,vacation",
  people: "people,portrait,person,human,face",
  technology: "technology,computer,gadget,innovation,digital",
  art: "art,painting,sculpture,creative,design",
  sports: "sports,fitness,athlete,game,competition",
  music: "music,instrument,concert,musician,band",
  business: "business,office,meeting,professional,work",
}

/**
 * Custom React Hook: useFetchImages
 * Fetches random images from Unsplash API (or fallback placeholders on error).
 *
 * @param {number} count - Number of images to fetch
 * @param {string} genre - Genre/category for image search
 * @returns {object} { images, loading, error, refetch }
 */
export default function useFetchImages(count = 6, genre = "nature") {
  const [images, setImages] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Fetch images from Unsplash
  const fetchImages = async () => {
    const apiKey = import.meta.env.VITE_UNSPLASH_ACCESS_KEY // must exist in .env

    if (!apiKey) {
      setError("Unsplash API key not configured. Please add VITE_UNSPLASH_ACCESS_KEY to your .env file.")
      return
    }

    setLoading(true)
    setError(null)

    try {
      const searchQuery = GENRE_SEARCH_TERMS[genre] || genre
      const response = await fetch(
        `${UNSPLASH_API_URL}?count=${count}&w=300&h=300&fit=crop&query=${encodeURIComponent(searchQuery)}`,
        {
          headers: {
            Authorization: `Client-ID ${apiKey}`, // ✅ Unsplash expects this
          },
        },
      )

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()

      // Normalize image data
      const processedImages = data.map((img, index) => ({
        id: img.id || `fallback-${index}`,
        url: img.urls?.small || `/placeholder.svg?height=300&width=300&query=${genre}-${index}`,
        alt: img.alt_description || `${genre} image ${index + 1}`,
      }))

      setImages(processedImages)
    } catch (err) {
      console.error("Failed to fetch images:", err)
      setError(err.message)

      const fallbackImages = Array.from({ length: count }, (_, index) => ({
        id: `fallback-${index}`,
        url: `/placeholder.svg?height=300&width=300&query=${genre}-${index}`,
        alt: `${genre} placeholder ${index + 1}`,
      }))
      setImages(fallbackImages)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchImages()
  }, [count, genre])

  return { images, loading, error, refetch: fetchImages }
}

export const AVAILABLE_GENRES = Object.keys(GENRE_SEARCH_TERMS)
