import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import HealthScoreWidget from "../components/HealthScoreWidget";
import RecentChecksCard from "../components/RecentChecksCard";
import { useAuth } from "../hooks/useAuth";
import api from "../services/api";

const HEALTH_TIPS = [
  "Drink at least 8 glasses of water daily to stay hydrated.",
  "A 30-minute walk can significantly reduce stress hormones.",
  "Getting 7–9 hours of sleep boosts immune function and mental clarity.",
  "Eating 5 servings of fruits & vegetables daily lowers disease risk by 20%.",
  "Deep breathing for 5 minutes can lower blood pressure immediately.",
];

const QUICK_ACTIONS = [
  { label: "Check Symptoms", icon: "◈", path: "/check", color: "#00e5ff", desc: "Analyze what you're feeling" },
  { label: "AI Assistant", icon: "◉", path: "/assistant", color: "#7b2ff7", desc: "Chat with health AI" },
  { label: "Scan Rx", icon: "⬙", path: "/scan", color: "#f59e0b", desc: "Upload a prescription" },
  { label: "History", icon: "◷", path: "/history", color: "#22c55e", desc: "View past checks" },
];

export default function DashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [checks, setChecks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [tip] = useState(HEALTH_TIPS[Math.floor(Math.random() * HEALTH_TIPS.length)]);

  const name = profile?.full_name || user?.user_metadata?.full_name || user?.email?.split("@")[0];
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [histRes, profRes] = await Promise.allSettled([
          api.get("/history/?page=1"),
          api.get("/profile/"),
        ]);
        if (histRes.status === "fulfilled") setChecks(histRes.value.data.results || histRes.value.data || []);
        if (profRes.status === "fulfilled") setProfile(profRes.value.data);
      } catch (_) {}
      finally { setLoading(false); }
    };
    fetchData();
  }, []);

  const healthScore = checks.length === 0 ? 82 : Math.min(100, Math.max(30,
    100 - (checks.slice(0, 5).reduce((a, c) => a + (c.severity || 5), 0) / Math.min(checks.length, 5)) * 5
  ));

  return (
    <div className="min-h-screen bg-[#0a0f1e] grid-bg">
      <Navbar />
      <Sidebar />

      <main className="lg:pl-60 pt-16">
        <div className="max-w-6xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <p className="text-sm text-slate-500 font-mono">{greeting},</p>
            <h1 className="font-display text-3xl font-bold text-white mt-0.5">
              {name} <span className="gradient-text">—</span>
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              {new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-6">
              {/* Quick Actions */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {QUICK_ACTIONS.map((a) => (
                  <Link
                    key={a.path} to={a.path}
                    className="glass rounded-2xl p-4 border border-[#1e293b] hover:border-opacity-50 transition-all hover:shadow-lg group text-center"
                    style={{ "--hover-color": a.color }}
                  >
                    <div className="text-2xl mb-2 transition-transform group-hover:scale-110" style={{ color: a.color }}>{a.icon}</div>
                    <p className="font-display font-semibold text-sm text-white">{a.label}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{a.desc}</p>
                  </Link>
                ))}
              </div>

              {/* Quick Check CTA */}
              <div className="relative glass rounded-2xl border border-[#00e5ff20] p-6 overflow-hidden">
                <div className="absolute top-0 right-0 w-48 h-48 bg-[#00e5ff] opacity-[0.03] rounded-full -translate-y-1/2 translate-x-1/2" />
                <div className="relative z-10">
                  <p className="text-xs text-[#00e5ff] font-mono uppercase tracking-widest mb-2">Quick Check</p>
                  <h2 className="font-display font-bold text-xl text-white mb-2">Not feeling well?</h2>
                  <p className="text-sm text-slate-400 mb-4">Run a symptom check in under 2 minutes and get AI-powered insights.</p>
                  <button
                    onClick={() => navigate("/check")}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#00e5ff] to-[#7b2ff7] text-white font-display font-semibold text-sm hover:opacity-90 transition-opacity"
                  >
                    Check Symptoms →
                  </button>
                </div>
              </div>

              {/* Recent Checks */}
              <RecentChecksCard checks={checks} loading={loading} />
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              <HealthScoreWidget score={Math.round(healthScore)} />

              {/* Health Tip */}
              <div className="glass rounded-2xl border border-[#22c55e25] p-5">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-[#22c55e] text-sm">◆</span>
                  <p className="text-xs text-[#22c55e] font-mono uppercase tracking-widest">Health Tip of the Day</p>
                </div>
                <p className="text-sm text-slate-300 leading-relaxed">{tip}</p>
              </div>

              {/* Stats */}
              <div className="glass rounded-2xl border border-[#1e293b] p-5">
                <p className="text-xs text-slate-500 font-mono uppercase tracking-widest mb-4">Your Stats</p>
                <div className="space-y-3">
                  {[
                    { label: "Total Checks", value: checks.length },
                    { label: "This Month", value: checks.filter((c) => new Date(c.created_at).getMonth() === new Date().getMonth()).length },
                    { label: "Most Common", value: checks[0]?.predicted_disease || "—" },
                  ].map((s) => (
                    <div key={s.label} className="flex items-center justify-between">
                      <span className="text-xs text-slate-500">{s.label}</span>
                      <span className="text-sm font-mono font-semibold text-white truncate ml-2 max-w-[120px] text-right">{s.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Disclaimer */}
          <div className="mt-8 p-4 rounded-xl border border-[#f59e0b20] bg-[#f59e0b05] flex gap-2">
            <span className="text-[#f59e0b] text-xs flex-shrink-0 mt-0.5">⚠</span>
            <p className="text-xs text-slate-500">
              MediWise is for informational purposes only. Always consult a qualified healthcare provider for diagnosis and treatment.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
