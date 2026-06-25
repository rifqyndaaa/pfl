import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabaseClient";
import { ImSpinner2 } from "react-icons/im";

export default function Register() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [dataForm, setDataForm] = useState({
    full_name: "",
    email: "",
    password: "",
    confirm_password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDataForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Validasi password
    if (dataForm.password !== dataForm.confirm_password) {
      setError("Password dan konfirmasi password tidak cocok.");
      return;
    }

    if (dataForm.password.length < 6) {
      setError("Password minimal 6 karakter.");
      return;
    }

    setLoading(true);

    // Register ke Supabase Auth
    const { data, error: authError } = await supabase.auth.signUp({
      email: dataForm.email.trim(),
      password: dataForm.password.trim(),
      options: {
        data: {
          full_name: dataForm.full_name.trim(),
        },
      },
    });

    // DEBUG: Memeriksa hasil data register di console browser
    console.log("SIGNUP RESULT:", data);
    console.log("SIGNUP ERROR:", authError);

    if (authError) {
      setError(authError.message || "Pendaftaran gagal.");
      setLoading(false);
      return;
    }

    setSuccess("Pendaftaran berhasil, silakan login.");
    setLoading(false);

    // Redirect ke login setelah 2 detik
    setTimeout(() => navigate("/login"), 2000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Daftar Akun Baru ✨
        </h1>
        <p className="text-xs text-slate-500 mt-1.5 font-medium">
          Buat akun BUIQ Anda untuk mulai mengelola bisnis boutique.
        </p>
      </div>

      {error && (
        <div className="bg-rose-50 border border-rose-100 text-rose-700 text-xs p-3 rounded-xl font-medium">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs p-3 rounded-xl font-medium">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Full Name */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Nama Lengkap
          </label>
          <input
            type="text"
            name="full_name"
            placeholder="Sarah Miller"
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-primary focus:ring-1 focus:ring-primary text-xs outline-none transition-all placeholder:text-slate-400 font-semibold"
            value={dataForm.full_name}
            onChange={handleChange}
            required
          />
        </div>

        {/* Email */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Email Address
          </label>
          <input
            type="email"
            name="email"
            placeholder="you@example.com"
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-primary focus:ring-1 focus:ring-primary text-xs outline-none transition-all placeholder:text-slate-400 font-semibold"
            value={dataForm.email}
            onChange={handleChange}
            required
          />
        </div>

        {/* Password */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Password
          </label>
          <input
            type="password"
            name="password"
            placeholder="••••••••"
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-primary focus:ring-1 focus:ring-primary text-xs outline-none transition-all placeholder:text-slate-400"
            value={dataForm.password}
            onChange={handleChange}
            required
          />
        </div>

        {/* Confirm Password */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Konfirmasi Password
          </label>
          <input
            type="password"
            name="confirm_password"
            placeholder="••••••••"
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-primary focus:ring-1 focus:ring-primary text-xs outline-none transition-all placeholder:text-slate-400"
            value={dataForm.confirm_password}
            onChange={handleChange}
            required
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-primary hover:bg-primary-hover text-white text-xs font-bold py-2.5 rounded-xl flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer disabled:opacity-50 mt-2"
        >
          {loading ? (
            <><ImSpinner2 className="animate-spin text-sm" /><span>Mendaftarkan...</span></>
          ) : (
            <span>Daftar Sekarang</span>
          )}
        </button>
      </form>

      <div className="text-center text-xs text-slate-500 font-semibold pt-2">
        <span>Sudah memiliki akun? </span>
        <Link to="/login" className="text-primary hover:underline">
          Masuk di sini
        </Link>
      </div>
    </div>
  );
}