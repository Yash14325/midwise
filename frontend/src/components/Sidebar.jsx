import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { authService } from "../services/auth";

const LINKS = [
  { label: "Dashboard", path: "/dashboard", icon: "⬡" },
  { label: "Check Symptoms", path: "/check", icon: "◈" },
  { label: "History", path: "/history", icon: "◷" },
  { label: "Scan Rx", path: "/scan", icon: "⬙" },
  { label: "AI Assistant", path: "/assistant", icon: "◉" },
];

export default function Sidebar() {
  const { user, setUser } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await authService.signOut();
    setUser(null);
    navigate("/login");
  };

  return (
    <aside className="hidden lg:flex flex-col w-60 min-h-screen fixed left-0 top-0 z-40 glass border-r border-[#1e293b] pt-20 pb-6 px-3">
      {/* Logo area */}
      <div className="mb-6 px-2">
        <p className="text-xs text-slate-500 uppercase tracking-widest font-mono">Navigation</p>
      </div>

      {/* Nav Links */}
      <nav className="flex-1 space-y-1">
        {LINKS.map((link) => {
          const active = location.pathname === link.path;
          return (
            <Link
              key={link.path}
              to={link.path}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${
                active
                  ? "bg-gradient-to-r from-[#00e5ff15] to-[#7b2ff715] text-[#00e5ff] border border-[#00e5ff25]"
                  : "text-slate-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <span className={`text-base transition-transform group-hover:scale-110 ${active ? "text-[#00e5ff]" : ""}`}>
                {link.icon}
              </span>
              {link.label}
              {active && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[#00e5ff] animate-pulse" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* User Footer */}
      <div className="border-t border-[#1e293b] pt-4 mt-4">
        <div className="flex items-center gap-3 px-2 mb-3">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#00e5ff] to-[#7b2ff7] flex items-center justify-center text-sm font-bold text-white flex-shrink-0">
            {user?.email?.[0]?.toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="text-xs font-medium text-white truncate">{user?.email}</p>
            <p className="text-xs text-slate-500">Active</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-slate-400 hover:text-[#ff4d6d] hover:bg-[#ff4d6d10] transition-all"
        >
          <span>⇥</span> Sign out
        </button>
      </div>
    </aside>
  );
}
