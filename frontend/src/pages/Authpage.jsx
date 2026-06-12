import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { authService } from "../services/auth";

export default function AuthPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, setUser } = useAuth();
  const [tab, setTab] = useState(location.pathname === "/signup" ? "signup" : "login");
  const [form, setForm] = useState({ fullName: "", email: "", password: "", confirmPassword: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (user) navigate("/dashboard");
  }, [user]);

  useEffect(() => {
    setTab(location.pathname === "/signup" ? "signup" : "login");
    setError(""); setSuccess("");
  }, [location.pathname]);

  const update = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); setSuccess(""); setLoading(true);
    try {
      if (tab === "signup") {
        if (form.password !== form.confirmPassword) throw new Error("Passwords do not match.");
        if (form.password.length < 6) throw new Error("Password must be at least 6 characters.");
        const data = await authService.signUp({ email: form.email, password: form.password, fullName: form.fullName });
        setUser(data.user);
        setSuccess("Account created successfully.");
        navigate("/profile-setup");
      } else {
        const data = await authService.signIn({ email: form.email, password: form.password });
        setUser(data.user);
        navigate("/dashboard");
      }
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!form.email) { setError("Enter your email first."); return; }
    try {
      await authService.resetPassword(form.email);
      setSuccess("Password reset link sent to your email.");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0f1e] grid-bg flex items-center justify-center px-4 py-16">
      {/* Ambient glow */}
      <div className="fixed top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-[#7b2ff7] opacity-[0.04] rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 justify-center mb-8">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#00e5ff] to-[#7b2ff7] flex items-center justify-center text-base font-bold text-white font-display">
            M
          </div>
          <span className="font-display font-bold text-xl text-white">
            Medi<span className="text-[#00e5ff]">Wise</span>
          </span>
        </Link>

        <div className="glass rounded-2xl border border-[#1e293b] overflow-hidden">
          {/* Tabs */}
          <div className="flex border-b border-[#1e293b]">
            {[
              { key: "login", label: "Log In", path: "/login" },
              { key: "signup", label: "Sign Up", path: "/signup" },
            ].map((t) => (
              <Link
                key={t.key}
                to={t.path}
                className={`flex-1 py-4 text-center text-sm font-display font-semibold transition-all ${
                  tab === t.key
                    ? "text-[#00e5ff] border-b-2 border-[#00e5ff] bg-[#00e5ff08]"
                    : "text-slate-500 hover:text-white"
                }`}
              >
                {t.label}
              </Link>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <h2 className="font-display text-xl font-bold text-white mb-1">
              {tab === "login" ? "Welcome back" : "Create your account"}
            </h2>
            <p className="text-sm text-slate-500 mb-4">
              {tab === "login" ? "Sign in to your MediWise account." : "Start your health intelligence journey."}
            </p>

            {tab === "signup" && (
              <div>
                <label className="block text-xs text-slate-400 mb-1.5 font-medium">Full Name</label>
                <input
                  type="text" required value={form.fullName} onChange={update("fullName")}
                  placeholder="Your full name"
                  className="w-full bg-[#0a0f1e] border border-[#1e293b] rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-[#00e5ff] transition-colors"
                />
              </div>
            )}

            <div>
              <label className="block text-xs text-slate-400 mb-1.5 font-medium">Email</label>
              <input
                type="email" required value={form.email} onChange={update("email")}
                placeholder="you@example.com"
                className="w-full bg-[#0a0f1e] border border-[#1e293b] rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-[#00e5ff] transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs text-slate-400 mb-1.5 font-medium">Password</label>
              <input
                type="password" required value={form.password} onChange={update("password")}
                placeholder={tab === "signup" ? "Min 6 characters" : "Your password"}
                className="w-full bg-[#0a0f1e] border border-[#1e293b] rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-[#00e5ff] transition-colors"
              />
            </div>

            {tab === "signup" && (
              <div>
                <label className="block text-xs text-slate-400 mb-1.5 font-medium">Confirm Password</label>
                <input
                  type="password" required value={form.confirmPassword} onChange={update("confirmPassword")}
                  placeholder="Repeat password"
                  className="w-full bg-[#0a0f1e] border border-[#1e293b] rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-[#00e5ff] transition-colors"
                />
              </div>
            )}

            {tab === "login" && (
              <div className="text-right">
                <button type="button" onClick={handleForgotPassword} className="text-xs text-slate-500 hover:text-[#00e5ff] transition-colors">
                  Forgot password?
                </button>
              </div>
            )}

            {error && (
              <div className="p-3 rounded-xl bg-[#ff4d6d10] border border-[#ff4d6d30] text-sm text-[#ff4d6d]">
                {error}
              </div>
            )}
            {success && (
              <div className="p-3 rounded-xl bg-[#22c55e10] border border-[#22c55e30] text-sm text-[#22c55e]">
                {success}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-[#00e5ff] to-[#7b2ff7] text-white font-display font-semibold text-sm hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Loading...</>
              ) : tab === "login" ? "Sign In →" : "Create Account →"}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-slate-600 mt-6">
          By continuing you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  );
}
