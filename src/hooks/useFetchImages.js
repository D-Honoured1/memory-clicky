export default function useFetchImages(query = "nature", perPage = 12) {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchImages() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(
          `https://api.unsplash.com/search/photos?query=${query}&per_page=${perPage}&client_id=${
            import.meta.env.VITE_UNSPLASH_ACCESS_KEY
          }`
        );
        if (!res.ok) throw new Error("Failed to fetch images");
        const data = await res.json();
        setImages(data.results || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchImages();
  }, [query, perPage]);

  return { images, loading, error };
}
