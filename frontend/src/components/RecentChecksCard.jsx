import { useNavigate } from "react-router-dom";
import PredictionCard from "./PredictionCard";

export default function RecentChecksCard({ checks = [], loading }) {
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="glass rounded-2xl p-5 border border-[#1e293b]">
        <p className="text-sm font-display font-semibold text-white mb-4">Recent Checks</p>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 rounded-xl bg-[#1e293b] animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="glass rounded-2xl p-5 border border-[#1e293b]">
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm font-display font-semibold text-white">Recent Checks</p>
        <button
          onClick={() => navigate("/history")}
          className="text-xs text-slate-500 hover:text-[#00e5ff] transition-colors"
        >
          View all →
        </button>
      </div>

      {checks.length === 0 ? (
        <div className="py-8 text-center">
          <p className="text-3xl mb-2">◈</p>
          <p className="text-sm text-slate-500">No symptom checks yet</p>
          <button
            onClick={() => navigate("/check")}
            className="mt-3 text-xs text-[#00e5ff] hover:underline"
          >
            Check your symptoms now →
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          {checks.slice(0, 4).map((check) => (
            <PredictionCard key={check.id} check={check} compact />
          ))}
        </div>
      )}
    </div>
  );
}
