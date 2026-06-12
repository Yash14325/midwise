import { useEffect, useState } from "react";

export default function HealthScoreWidget({ score = 78 }) {
  const [displayScore, setDisplayScore] = useState(0);

  useEffect(() => {
    let start = 0;
    const step = score / 60;
    const interval = setInterval(() => {
      start += step;
      if (start >= score) {
        setDisplayScore(score);
        clearInterval(interval);
      } else {
        setDisplayScore(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(interval);
  }, [score]);

  const getColor = (s) => {
    if (s >= 80) return "#22c55e";
    if (s >= 60) return "#f59e0b";
    if (s >= 40) return "#ef4444";
    return "#ff4d6d";
  };

  const getLabel = (s) => {
    if (s >= 80) return "Excellent";
    if (s >= 60) return "Good";
    if (s >= 40) return "Fair";
    return "Poor";
  };

  const color = getColor(score);
  const circumference = 2 * Math.PI * 54;
  const dashOffset = circumference - (displayScore / 100) * circumference;

  return (
    <div className="glass rounded-2xl p-6 border border-[#1e293b] flex flex-col items-center">
      <p className="text-xs text-slate-500 uppercase tracking-widest mb-4 font-mono">Health Score</p>

      <div className="relative w-36 h-36">
        <svg viewBox="0 0 120 120" className="w-36 h-36 -rotate-90">
          {/* Background ring */}
          <circle cx="60" cy="60" r="54" fill="none" stroke="#1e293b" strokeWidth="8" />
          {/* Progress ring */}
          <circle
            cx="60" cy="60" r="54"
            fill="none"
            stroke={color}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
            style={{ transition: "stroke-dashoffset 0.05s linear", filter: `drop-shadow(0 0 8px ${color}80)` }}
          />
        </svg>

        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-4xl font-display font-bold" style={{ color }}>
            {displayScore}
          </span>
          <span className="text-xs text-slate-500">/100</span>
        </div>
      </div>

      <div className="mt-3 text-center">
        <p className="font-display font-semibold text-lg" style={{ color }}>{getLabel(score)}</p>
        <p className="text-xs text-slate-500 mt-1">
          Based on your recent checks & profile
        </p>
      </div>

      {/* Mini metrics */}
      <div className="w-full mt-5 grid grid-cols-3 gap-2 border-t border-[#1e293b] pt-4">
        {[
          { label: "Checks", value: "12" },
          { label: "Avg Severity", value: "4.2" },
          { label: "Streak", value: "3d" },
        ].map((m) => (
          <div key={m.label} className="text-center">
            <p className="text-sm font-mono font-bold text-white">{m.value}</p>
            <p className="text-xs text-slate-600">{m.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
