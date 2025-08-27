import { useState, useEffect } from "react";

export default function useFetchImages(query = "nature") {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchImages() {
      try {
        const response = await fetch(
          `https://api.unsplash.com/search/photos?query=${query}&per_page=12&client_id=${import.meta.env.VITE_UNSPLASH_KEY}`
        );

        const data = await response.json();
        setImages(data.results || []);
      } catch (error) {
        console.error("Error fetching images:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchImages();
  }, [query]);

  return { images, loading };
}
