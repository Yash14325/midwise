const LABELS = {
  1: { text: "Minimal", color: "#22c55e" },
  2: { text: "Very Mild", color: "#4ade80" },
  3: { text: "Mild", color: "#86efac" },
  4: { text: "Mild-Moderate", color: "#facc15" },
  5: { text: "Moderate", color: "#f59e0b" },
  6: { text: "Moderate-Severe", color: "#fb923c" },
  7: { text: "Severe", color: "#ef4444" },
  8: { text: "Very Severe", color: "#dc2626" },
  9: { text: "Critical", color: "#b91c1c" },
  10: { text: "Emergency", color: "#ff4d6d" },
};

export default function SeveritySlider({ value, onChange }) {
  const label = LABELS[value] || LABELS[5];
  const percent = ((value - 1) / 9) * 100;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm text-slate-400">Pain / Discomfort Level</span>
        <span
          className="text-sm font-bold font-mono px-2 py-0.5 rounded-lg"
          style={{ color: label.color, background: `${label.color}15`, border: `1px solid ${label.color}30` }}
        >
          {value}/10 — {label.text}
        </span>
      </div>

      <div className="relative h-2 rounded-full bg-[#1e293b]">
        <div
          className="absolute left-0 top-0 h-2 rounded-full transition-all duration-200"
          style={{
            width: `${percent}%`,
            background: `linear-gradient(90deg, #22c55e, ${label.color})`,
          }}
        />
        <input
          type="range"
          min={1}
          max={10}
          step={1}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="absolute inset-0 w-full opacity-0 cursor-pointer h-2"
          style={{ zIndex: 2 }}
        />
        {/* Thumb */}
        <div
          className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-2 border-white shadow-lg transition-all duration-200"
          style={{
            left: `calc(${percent}% - 8px)`,
            background: label.color,
            boxShadow: `0 0 10px ${label.color}80`,
          }}
        />
      </div>

      {/* Scale Labels */}
      <div className="flex justify-between text-xs text-slate-600 font-mono">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
          <button
            key={n}
            onClick={() => onChange(n)}
            className={`w-5 text-center transition-colors hover:text-slate-300 ${value === n ? "text-white font-bold" : ""}`}
          >
            {n}
          </button>
        ))}
      </div>

      {/* Severity Legend */}
      <div className="flex gap-3 flex-wrap mt-1">
        {[
          { range: "1–3", label: "Mild", color: "#22c55e" },
          { range: "4–6", label: "Moderate", color: "#f59e0b" },
          { range: "7–8", label: "Severe", color: "#ef4444" },
          { range: "9–10", label: "Emergency", color: "#ff4d6d" },
        ].map((item) => (
          <div key={item.label} className="flex items-center gap-1.5 text-xs text-slate-500">
            <span className="w-2 h-2 rounded-full" style={{ background: item.color }} />
            <span>{item.range}: {item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
