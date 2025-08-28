"use client"

import { useState, useEffect } from "react"

const UNSPLASH_API_URL = "https://api.unsplash.com/photos/random"

export default function useFetchImages(count = 6) {
  const [images, setImages] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchImages = async () => {
    const apiKey = process.env.EDLeG7gpjcu42WYXIpcNbqvVtOUnivwnfc_Ujf5Aw4w

    if (!apiKey) {
      setError("Unsplash API key not configured. Please add REACT_APP_UNSPLASH_API_KEY to your environment variables.")
      return
    }

    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`${UNSPLASH_API_URL}?count=${count}&w=300&h=300&fit=crop`, {
        headers: {
          Authorization: `Client-ID ${apiKey}`,
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()

      const processedImages = data.map((img, index) => ({
        id: img.id || `fallback-${index}`,
        url: img.urls?.small || `/placeholder.svg?height=300&width=300&query=nature-${index}`,
        alt: img.alt_description || `Image ${index + 1}`,
      }))

      setImages(processedImages)
    } catch (err) {
      console.error("Failed to fetch images:", err)
      setError(err.message)

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

  useEffect(() => {
    fetchImages()
  }, [count])

  return { images, loading, error, refetch: fetchImages }
}
