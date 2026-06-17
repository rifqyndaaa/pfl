import { Link } from "react-router-dom";

export default function Forgot() {
  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Lupa Password?</h1>
        <p className="text-xs text-slate-500 mt-1.5 font-medium leading-relaxed">
          Masukkan alamat email Anda, dan kami akan mengirimkan tautan untuk menyetel ulang password Anda.
        </p>
      </div>

      <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
        {/* Email Field */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Email Address</label>
          <input
            type="email"
            placeholder="you@example.com"
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-primary focus:ring-1 focus:ring-primary text-xs outline-none transition-all placeholder:text-slate-400"
            required
          />
        </div>

        {/* Submit button */}
        <button
          type="submit"
          className="w-full bg-primary hover:bg-primary-hover text-white text-xs font-bold py-2.5 rounded-xl flex items-center justify-center shadow-sm transition-all cursor-pointer mt-2"
        >
          Kirim Tautan Reset
        </button>
      </form>

      {/* Footer link */}
      <div className="text-center text-xs text-slate-500 font-semibold pt-2">
        <Link to="/login" className="text-primary hover:underline">
          Kembali ke Halaman Login
        </Link>
      </div>
    </div>
  );
}
