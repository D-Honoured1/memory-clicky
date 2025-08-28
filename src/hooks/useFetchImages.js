"use client"

import { useState, useEffect } from "react"

// Base Unsplash API endpoint for random photos
const UNSPLASH_API_URL = "https://api.unsplash.com/photos/random"

/**
 * Custom React Hook: useFetchImages
 * Fetches random images from Unsplash API (or fallback placeholders on error).
 *
 * @param {number} count - Number of images to fetch
 * @returns {object} { images, loading, error, refetch }
 */
export default function useFetchImages(count = 6) {
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
      const response = await fetch(
        `${UNSPLASH_API_URL}?count=${count}&w=300&h=300&fit=crop`,
        {
          headers: {
            Authorization: `Client-ID ${apiKey}`, // ✅ Unsplash expects this
          },
        }
      )

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()

      // Normalize image data
      const processedImages = data.map((img, index) => ({
        id: img.id || `fallback-${index}`,
        url: img.urls?.small || `/placeholder.svg?height=300&width=300&query=nature-${index}`,
        alt: img.alt_description || `Image ${index + 1}`,
      }))

      setImages(processedImages)
    } catch (err) {
      console.error("Failed to fetch images:", err)
      setError(err.message)

      // Fallback placeholders if Unsplash API fails
      const fallbackImages = Array.from({ length: count }, (_, index) => ({
        id: `fallback-${index}`,
        url: `/placeholder.svg?height=300&width=300&query=placeholder-${index}`,
        alt: `Placeholder image ${index + 1}`,
      }))
      setImages(fallbackImages)
    } finally {
      setLoading(false)
    }
  }

  // Fetch images on mount or when `count` changes
  useEffect(() => {
    fetchImages()
  }, [count])

  return { images, loading, error, refetch: fetchImages }
}
