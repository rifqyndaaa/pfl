import axios from "axios";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ImSpinner2 } from "react-icons/im";
import { FaGoogle, FaLinkedin, FaFacebook } from "react-icons/fa";

export default function Login() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [loginRole, setLoginRole] = useState("admin"); // 'admin' or 'member'

  const [dataForm, setDataForm] = useState({
    email: "emilys",
    password: "emilyspass",
  });

  const handleRoleChange = (role) => {
    setLoginRole(role);
    if (role === "admin") {
      setDataForm({ email: "emilys", password: "emilyspass" });
    } else {
      setDataForm({ email: "member", password: "member123" });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDataForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const username = dataForm.email.trim();
    const password = dataForm.password.trim();

    // 1. Check for specific Admin Account
    if (loginRole === "admin" && username === "emilys" && password === "emilyspass") {
      setTimeout(() => {
        const userObj = {
          id: 1,
          username: "emilys",
          email: "emily.johnson@x.dummyjson.com",
          firstName: "Emily",
          lastName: "Johnson",
          gender: "female",
          image: "https://dummyjson.com/icon/emilys/128",
          role: "admin",
          token: "mock-admin-token"
        };
        localStorage.setItem("buiq_token", userObj.token);
        localStorage.setItem("buiq_user", JSON.stringify(userObj));
        setLoading(false);
        navigate("/dashboard");
      }, 500);
      return;
    }

    // 2. Check for specific Member Account
    if (loginRole === "member" && username === "member" && password === "member123") {
      setTimeout(() => {
        const userObj = {
          id: 999,
          username: "member",
          email: "member@buiq.com",
          firstName: "Sarah",
          lastName: "Miller",
          gender: "female",
          image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop",
          role: "member",
          token: "mock-member-token"
        };
        localStorage.setItem("buiq_token", userObj.token);
        localStorage.setItem("buiq_user", JSON.stringify(userObj));
        setLoading(false);
        navigate("/member-dashboard");
      }, 500);
      return;
    }

    // 3. Fallback to API for general testing
    axios
      .post("https://dummyjson.com/user/login", {
        username: username,
        password: password,
      })
      .then((response) => {
        if (response.status === 200) {
          const token = response.data.token || response.data.accessToken;
          const userObj = {
            ...response.data,
            token: token,
            role: loginRole
          };
          localStorage.setItem("buiq_token", token);
          localStorage.setItem("buiq_user", JSON.stringify(userObj));
          if (loginRole === "admin") {
            navigate("/dashboard");
          } else {
            navigate("/member-dashboard");
          }
        }
      })
      .catch((err) => {
        setError(err?.response?.data?.message || "Login gagal");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Selamat Datang Kembali</h1>
        <p className="text-xs text-slate-500 mt-1.5 font-medium">
          {loginRole === "admin"
            ? "Silakan masuk ke akun BUIQ Anda untuk mulai mengelola boutique."
            : "Silakan masuk ke akun member Anda untuk melihat loyalty & fashion reward."}
        </p>
      </div>

      {/* Role Selection Tabs */}
      <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200/40">
        <button
          type="button"
          onClick={() => handleRoleChange("admin")}
          className={`flex-1 py-2 text-center text-xs font-bold rounded-lg transition-all cursor-pointer ${
            loginRole === "admin"
              ? "bg-[#2B7FFF] text-white shadow-sm"
              : "text-slate-500 hover:text-slate-800"
          }`}
        >
          Admin Portal
        </button>
        <button
          type="button"
          onClick={() => handleRoleChange("member")}
          className={`flex-1 py-2 text-center text-xs font-bold rounded-lg transition-all cursor-pointer ${
            loginRole === "member"
              ? "bg-[#2B7FFF] text-white shadow-sm"
              : "text-slate-500 hover:text-slate-800"
          }`}
        >
          Member Loyalty Portal
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-rose-50 border border-rose-100 text-rose-700 text-xs p-3 rounded-xl font-medium">
          {error}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email Field */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Username / Email</label>
          <input
            type="text"
            name="email"
            placeholder={loginRole === "admin" ? "Contoh: emilys" : "Contoh: member"}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-primary focus:ring-1 focus:ring-primary text-xs outline-none transition-all placeholder:text-slate-400 font-semibold"
            value={dataForm.email}
            onChange={handleChange}
            required
          />
        </div>

        {/* Password Field */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-center">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Password</label>
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

        {/* Remember me checkbox */}
        <label className="flex items-center gap-2 text-xs text-slate-500 font-semibold cursor-pointer">
          <input
            type="checkbox"
            className="rounded border-slate-300 text-primary focus:ring-primary"
          />
          <span>Ingat Saya</span>
        </label>

        {/* Submit Buttons */}
        <div className="flex flex-col gap-2 pt-2">
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary hover:bg-primary-hover text-white text-xs font-bold py-2.5 rounded-xl flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <>
                <ImSpinner2 className="animate-spin text-sm" />
                <span>Memproses...</span>
              </>
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

      {/* Social Login Separator */}
      <div className="relative flex py-2 items-center">
        <div className="flex-grow border-t border-slate-200"></div>
        <span className="flex-shrink mx-4 text-slate-400 text-[10px] font-bold uppercase tracking-wider">Atau masuk dengan</span>
        <div className="flex-grow border-t border-slate-200"></div>
      </div>

      {/* Social Grid */}
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