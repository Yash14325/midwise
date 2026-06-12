import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { authService } from "../services/auth";

const NAV_LINKS = [
  { label: "Dashboard", path: "/dashboard", icon: "⬡" },
  { label: "Check Symptoms", path: "/check", icon: "◈" },
  { label: "History", path: "/history", icon: "◷" },
  { label: "Scan Rx", path: "/scan", icon: "⬙" },
  { label: "AI Assistant", path: "/assistant", icon: "◉" },
];

export default function Navbar() {
  const { user, setUser } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    await authService.signOut();
    setUser(null);
    navigate("/login");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-[#1e293b]">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#00e5ff] to-[#7b2ff7] flex items-center justify-center text-sm font-bold text-white font-display">
            M
          </div>
          <span className="font-display font-bold text-lg tracking-tight text-white">
            Medi<span className="text-[#00e5ff]">Wise</span>
          </span>
        </Link>

        {/* Desktop Links */}
        {user && (
          <div className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-1.5 ${
                  location.pathname === link.path
                    ? "bg-[#00e5ff15] text-[#00e5ff] border border-[#00e5ff30]"
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <span className="text-xs opacity-70">{link.icon}</span>
                {link.label}
              </Link>
            ))}
          </div>
        )}

        {/* Right Side */}
        <div className="flex items-center gap-3">
          {user ? (
            <>
              <div className="hidden md:flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#00e5ff] to-[#7b2ff7] flex items-center justify-center text-xs font-bold text-white">
                  {user.email?.[0]?.toUpperCase()}
                </div>
                <button
                  onClick={handleLogout}
                  className="text-sm text-slate-400 hover:text-[#ff4d6d] transition-colors px-2 py-1"
                >
                  Logout
                </button>
              </div>
              {/* Hamburger */}
              <button
                className="md:hidden text-slate-400 hover:text-white"
                onClick={() => setMenuOpen(!menuOpen)}
              >
                <div className="w-5 h-4 flex flex-col justify-between">
                  <span className={`block h-0.5 bg-current transition-all ${menuOpen ? "rotate-45 translate-y-2" : ""}`} />
                  <span className={`block h-0.5 bg-current transition-all ${menuOpen ? "opacity-0" : ""}`} />
                  <span className={`block h-0.5 bg-current transition-all ${menuOpen ? "-rotate-45 -translate-y-1.5" : ""}`} />
                </div>
              </button>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login" className="text-sm text-slate-400 hover:text-white transition-colors px-3 py-1.5">
                Log in
              </Link>
              <Link
                to="/signup"
                className="text-sm font-medium bg-[#00e5ff] text-[#0a0f1e] px-3 py-1.5 rounded-lg hover:bg-[#00c8e0] transition-colors"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && user && (
        <div className="md:hidden border-t border-[#1e293b] bg-[#0a0f1e] px-4 py-3 space-y-1">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setMenuOpen(false)}
              className={`block px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                location.pathname === link.path
                  ? "bg-[#00e5ff15] text-[#00e5ff]"
                  : "text-slate-400 hover:text-white hover:bg-white/5"
              }`}
            >
              {link.icon} {link.label}
            </Link>
          ))}
          <button
            onClick={handleLogout}
            className="block w-full text-left px-3 py-2 rounded-lg text-sm text-[#ff4d6d] hover:bg-[#ff4d6d10]"
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  );
}
