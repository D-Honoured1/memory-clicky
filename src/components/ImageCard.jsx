import useFetchImages from "../hooks/useFetchImages";

export default function ImageGrid() {
  const { images, loading } = useFetchImages("nature");

  if (loading) return <p className="text-center p-4">Loading...</p>;

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
      {images.map((img) => (
        <div
          key={img.id}
          className="bg-white shadow-md rounded-lg overflow-hidden cursor-pointer hover:scale-105 transition-transform"
        >
          <img
            src={img.urls.small}
            alt={img.alt_description || "Unsplash Image"}
            className="w-full h-48 object-cover"
          />
          <p className="p-2 text-sm text-gray-600 truncate">
            {img.alt_description || "Untitled"}
          </p>
        </div>
      ))}
    </div>
  );
}
