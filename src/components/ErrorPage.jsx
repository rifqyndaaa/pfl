import { Link } from "react-router-dom";

export default function ErrorPage({ code, description, image }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6 space-y-6">
      {image && (
        <img
          src={image}
          alt={`Error ${code}`}
          className="w-48 h-48 object-contain opacity-85"
        />
      )}
      
      <div className="space-y-2">
        <h1 className="text-7xl font-extrabold tracking-tight text-slate-900">{code}</h1>
        <p className="text-sm text-slate-500 font-medium max-w-sm mx-auto leading-relaxed">{description}</p>
      </div>

      <Link
        to="/"
        className="inline-flex items-center justify-center bg-primary hover:bg-primary-hover text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-sm transition-all cursor-pointer"
      >
        Kembali ke Dashboard
      </Link>
    </div>
  );
}