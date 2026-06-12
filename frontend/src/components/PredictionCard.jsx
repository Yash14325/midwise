import { useNavigate } from "react-router-dom";

const SEVERITY_STYLES = {
  Mild: { color: "#22c55e", bg: "#22c55e15", border: "#22c55e30" },
  Moderate: { color: "#f59e0b", bg: "#f59e0b15", border: "#f59e0b30" },
  Severe: { color: "#ef4444", bg: "#ef444415", border: "#ef444430" },
  Critical: { color: "#ff4d6d", bg: "#ff4d6d15", border: "#ff4d6d30" },
};

export default function PredictionCard({ check, compact = false }) {
  const navigate = useNavigate();
  const style = SEVERITY_STYLES[check.severity_label] || SEVERITY_STYLES.Mild;
  const confidence = Math.round((check.confidence_score || 0) * 100);

  return (
    <div
      onClick={() => navigate(`/results/${check.id}`)}
      className="glass rounded-2xl p-4 cursor-pointer hover:border-[#00e5ff30] transition-all duration-200 hover:shadow-[0_0_20px_rgba(0,229,255,0.1)] group border border-[#1e293b]"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-display font-semibold text-white group-hover:text-[#00e5ff] transition-colors truncate">
            {check.predicted_disease}
          </h3>
          {!compact && (
            <div className="flex flex-wrap gap-1 mt-1.5">
              {(check.symptoms || []).slice(0, 3).map((s) => (
                <span key={s} className="text-xs text-slate-500 bg-[#1e293b] px-2 py-0.5 rounded-full">
                  {s.replace(/_/g, " ")}
                </span>
              ))}
              {check.symptoms?.length > 3 && (
                <span className="text-xs text-slate-600">+{check.symptoms.length - 3} more</span>
              )}
            </div>
          )}
          <p className="text-xs text-slate-500 mt-1.5">
            {new Date(check.created_at).toLocaleDateString("en-IN", {
              day: "numeric", month: "short", year: "numeric",
            })}
          </p>
        </div>

        <div className="flex flex-col items-end gap-2 flex-shrink-0">
          {/* Confidence */}
          <div className="relative w-12 h-12">
            <svg viewBox="0 0 36 36" className="w-12 h-12 -rotate-90">
              <circle cx="18" cy="18" r="15.9" fill="none" stroke="#1e293b" strokeWidth="3" />
              <circle
                cx="18" cy="18" r="15.9" fill="none"
                stroke="#00e5ff" strokeWidth="3"
                strokeDasharray={`${confidence} 100`}
                strokeLinecap="round"
              />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-xs font-bold font-mono text-[#00e5ff]">
              {confidence}%
            </span>
          </div>

          {/* Severity Badge */}
          <span
            className="text-xs font-medium px-2 py-0.5 rounded-full"
            style={{ color: style.color, background: style.bg, border: `1px solid ${style.border}` }}
          >
            {check.severity_label}
          </span>
        </div>
      </div>

      {!compact && (
        <div className="mt-3 flex items-center text-xs text-slate-500 group-hover:text-[#00e5ff] transition-colors">
          View full results →
        </div>
      )}
    </div>
  );
}
