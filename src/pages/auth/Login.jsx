import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabaseClient";
import { useAuth } from "../../context/AuthContext";
import { ImSpinner2 } from "react-icons/im";
import { FaGoogle, FaLinkedin, FaFacebook } from "react-icons/fa";

export default function Login() {
  const navigate = useNavigate();
  const { login, logout } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [loginRole, setLoginRole] = useState("admin");
  const [dataForm, setDataForm] = useState({ email: "", password: "" });

  const handleRoleChange = (role) => {
    setLoginRole(role);
    setDataForm({ email: "", password: "" });
    setError("");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDataForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const emailInput = dataForm.email.trim();
      const passwordInput = dataForm.password.trim();

      // 1. Sign in via Supabase Auth directly
      let { data, error: authError } = await supabase.auth.signInWithPassword({
        email: emailInput,
        password: passwordInput,
      });

      // On-the-fly registration for the default admin account if it does not exist yet
      if (authError && emailInput === "admin@buiq.com" && passwordInput === "adminpassword123") {
        console.log("=== DEFAULT ADMIN NOT FOUND. SIGNING UP ON THE FLY ===");
        const signUpRes = await supabase.auth.signUp({
          email: "admin@buiq.com",
          password: "adminpassword123",
          options: {
            data: {
              full_name: "Admin Utama"
            }
          }
        });
        if (!signUpRes.error) {
          const secondSignIn = await supabase.auth.signInWithPassword({
            email: "admin@buiq.com",
            password: "adminpassword123",
          });
          if (!secondSignIn.error) {
            data = secondSignIn.data;
            authError = null;
          }
        }
      }

      if (authError) {
        throw authError;
      }

      if (!data || !data.user) {
        throw new Error("Gagal mengambil data autentikasi.");
      }

      // 2. Fetch role from profiles table (with default admin override)
      let role = "member";
      if (data.user.email === "admin@buiq.com") {
        role = "admin";
      } else {
        let { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", data.user.id)
          .single();

        if (profileError || !profile) {
          console.log("=== PROFILE FETCH ERROR (Attempting programmatic insert fallback) ===", profileError);
          
          const fullName = data.user.user_metadata?.full_name || data.user.email?.split("@")[0] || "User";
          
          const { data: newProfile, error: insertError } = await supabase
            .from("profiles")
            .insert({
              id: data.user.id,
              role: "member",
              full_name: fullName
            })
            .select("role")
            .single();

          if (!insertError && newProfile) {
            role = newProfile.role;
          } else {
            console.log("=== PROFILE INSERT FAILED (Defaulting to member role) ===", insertError);
            role = "member";
          }
        } else {
          role = profile.role;
        }
      }
      console.log("=== USER ROLE ===", role);

      // 3. Validasi role sesuai tab yang dipilih
      if (loginRole === "admin" && role !== "admin") {
        await logout();
        setError("Akun ini tidak memiliki akses Admin Portal.");
        setLoading(false);
        return;
      }

      if (loginRole === "member" && role !== "member") {
        await logout();
        setError("Akun ini bukan akun Member.");
        setLoading(false);
        return;
      }

      // 4. Redirect sesuai role
      navigate(role === "admin" ? "/dashboard" : "/member-dashboard");
    } catch (authError) {
      console.log("=== LOGIN AUTH ERROR ===", authError);
      setError(authError.message || "Email atau password salah.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Selamat Datang Kembali
        </h1>
        <p className="text-xs text-slate-500 mt-1.5 font-medium">
          {loginRole === "admin"
            ? "Silakan masuk ke akun BUIQ Anda untuk mulai mengelola boutique."
            : "Silakan masuk ke akun member Anda untuk melihat loyalty & fashion reward."}
        </p>
      </div>

      {/* Role Tabs */}
      <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200/40">
        {["admin", "member"].map((role) => (
          <button
            key={role}
            type="button"
            onClick={() => handleRoleChange(role)}
            className={`flex-1 py-2 text-center text-xs font-bold rounded-lg transition-all cursor-pointer ${
              loginRole === role
                ? "bg-[#2B7FFF] text-white shadow-sm"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            {role === "admin" ? "Admin Portal" : "Member Loyalty Portal"}
          </button>
        ))}
      </div>

      {error && (
        <div className="bg-rose-50 border border-rose-100 text-rose-700 text-xs p-3 rounded-xl font-medium">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Email
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

        <div className="space-y-1.5">
          <div className="flex justify-between items-center">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Password
            </label>
            <Link to="/forgot" className="text-[11px] font-bold text-primary hover:underline">
              Lupa Password?
            </Link>
          </div>
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

        <label className="flex items-center gap-2 text-xs text-slate-500 font-semibold cursor-pointer">
          <input type="checkbox" className="rounded border-slate-300 text-primary focus:ring-primary" />
          <span>Ingat Saya</span>
        </label>

        <div className="flex flex-col gap-2 pt-2">
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary hover:bg-primary-hover text-white text-xs font-bold py-2.5 rounded-xl flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <><ImSpinner2 className="animate-spin text-sm" /><span>Memproses...</span></>
            ) : (
              <span>Masuk Sekarang</span>
            )}
          </button>
          <Link
            to="/register"
            className="w-full border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold py-2.5 rounded-xl flex items-center justify-center transition-all cursor-pointer text-center"
          >
            Daftar Akun Baru
          </Link>
        </div>
      </form>

      <div className="relative flex py-2 items-center">
        <div className="flex-grow border-t border-slate-200"></div>
        <span className="flex-shrink mx-4 text-slate-400 text-[10px] font-bold uppercase tracking-wider">
          Atau masuk dengan
        </span>
        <div className="flex-grow border-t border-slate-200"></div>
      </div>

      <div className="grid grid-cols-3 gap-2">
        <button className="flex items-center justify-center py-2 border border-slate-200 rounded-xl hover:bg-slate-50 text-slate-500 transition-colors cursor-pointer">
          <FaGoogle size={14} className="text-rose-500" />
        </button>
        <button className="flex items-center justify-center py-2 border border-slate-200 rounded-xl hover:bg-slate-50 text-slate-500 transition-colors cursor-pointer">
          <FaLinkedin size={14} className="text-blue-700" />
        </button>
        <button className="flex items-center justify-center py-2 border border-slate-200 rounded-xl hover:bg-slate-50 text-slate-500 transition-colors cursor-pointer">
          <FaFacebook size={14} className="text-blue-800" />
        </button>
      </div>
    </div>
  );
}
