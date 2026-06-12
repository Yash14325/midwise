const PRESETS = [
  { label: "Today", days: 1 },
  { label: "2 days", days: 2 },
  { label: "3 days", days: 3 },
  { label: "1 week", days: 7 },
  { label: "2 weeks", days: 14 },
  { label: "1 month", days: 30 },
];

export default function DurationPicker({ value, onChange }) {
  const getDurationText = (days) => {
    if (days === 1) return "Since today";
    if (days < 7) return `${days} days`;
    if (days < 14) return "1 week";
    if (days < 30) return `${Math.floor(days / 7)} weeks`;
    return `${Math.floor(days / 30)} month(s)`;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-sm text-slate-400">How long have you had these symptoms?</span>
        <span className="text-sm font-mono font-bold text-[#00e5ff]">{getDurationText(value)}</span>
      </div>

      {/* Preset Chips */}
      <div className="flex flex-wrap gap-2">
        {PRESETS.map((p) => (
          <button
            key={p.days}
            onClick={() => onChange(p.days)}
            className={`text-xs px-3 py-1.5 rounded-full border transition-all font-medium ${
              value === p.days
                ? "bg-[#00e5ff] text-[#0a0f1e] border-[#00e5ff]"
                : "bg-transparent text-slate-400 border-[#1e293b] hover:border-[#00e5ff50] hover:text-white"
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Custom Slider */}
      <div className="space-y-2">
        <div className="relative h-2 rounded-full bg-[#1e293b]">
          <div
            className="absolute left-0 top-0 h-2 rounded-full bg-gradient-to-r from-[#00e5ff] to-[#7b2ff7] transition-all duration-200"
            style={{ width: `${((value - 1) / 29) * 100}%` }}
          />
          <input
            type="range"
            min={1}
            max={30}
            value={value}
            onChange={(e) => onChange(Number(e.target.value))}
            className="absolute inset-0 w-full opacity-0 cursor-pointer h-2"
            style={{ zIndex: 2 }}
          />
          <div
            className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-[#00e5ff] border-2 border-white shadow-lg transition-all duration-200"
            style={{
              left: `calc(${((value - 1) / 29) * 100}% - 8px)`,
              boxShadow: "0 0 10px rgba(0,229,255,0.5)",
            }}
          />
        </div>
        <div className="flex justify-between text-xs text-slate-600 font-mono">
          <span>1 day</span>
          <span>1 week</span>
          <span>2 weeks</span>
          <span>30 days</span>
        </div>
      </div>

      {/* Warning */}
      {value >= 14 && (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-[#f59e0b10] border border-[#f59e0b30] text-xs text-[#f59e0b]">
          <span>⚠</span>
          Symptoms lasting {value}+ days should be evaluated by a doctor.
        </div>
      )}
    </div>
  );
}
