export default function ErrorPage({ code, description, image }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center">
      {image && <img src={image} alt={`Error ${code}`} className="w-64 h-64 object-contain mb-6" />}
      <h1 className="text-8xl font-bold text-gray-800">{code}</h1>
      <p className="text-xl text-gray-600 mt-4">{description}</p>
      <button
        onClick={() => window.location.href = "/"}
        className="mt-8 bg-hijau text-white px-6 py-2 rounded-xl hover:bg-green-600 transition-colors cursor-pointer"
      >
        Kembali ke Dashboard
      </button>
    </div>
  );
}