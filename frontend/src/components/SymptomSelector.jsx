import { useState } from "react";

const SYMPTOMS = {
  "Head & Neurological": [
    "headache", "dizziness", "confusion", "memory_loss", "blurred_vision",
    "ringing_in_ears", "fainting", "tremors", "numbness", "migraine",
  ],
  "Respiratory": [
    "cough", "shortness_of_breath", "runny_nose", "sore_throat",
    "wheezing", "chest_tightness", "sneezing", "congestion", "hoarseness",
  ],
  "Digestive": [
    "nausea", "vomiting", "diarrhea", "abdominal_pain", "bloating",
    "constipation", "heartburn", "loss_of_appetite", "blood_in_stool",
  ],
  "Musculoskeletal": [
    "body_ache", "joint_pain", "back_pain", "muscle_weakness",
    "muscle_cramps", "stiffness", "swollen_joints", "neck_pain",
  ],
  "Skin": [
    "rash", "itching", "swelling", "jaundice", "bruising",
    "dry_skin", "hair_loss", "pale_skin", "skin_peeling",
  ],
  "General": [
    "fever", "fatigue", "chills", "weight_loss", "weight_gain",
    "night_sweats", "excessive_thirst", "frequent_urination", "anxiety", "insomnia",
  ],
};

const formatLabel = (s) => s.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

export default function SymptomSelector({ selected = [], onChange }) {
  const [search, setSearch] = useState("");
  const [openGroups, setOpenGroups] = useState({ General: true, Respiratory: true });

  const toggle = (symptom) => {
    onChange(
      selected.includes(symptom)
        ? selected.filter((s) => s !== symptom)
        : [...selected, symptom]
    );
  };

  const toggleGroup = (group) =>
    setOpenGroups((prev) => ({ ...prev, [group]: !prev[group] }));

  const filteredGroups = Object.entries(SYMPTOMS).map(([group, items]) => ({
    group,
    items: search
      ? items.filter((s) => s.includes(search.toLowerCase().replace(/ /g, "_")))
      : items,
  })).filter(({ items }) => !search || items.length > 0);

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm">⌕</span>
        <input
          type="text"
          placeholder="Search symptoms..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-[#0a0f1e] border border-[#1e293b] rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#00e5ff] transition-colors"
        />
        {search && (
          <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white">×</button>
        )}
      </div>

      {/* Selected count */}
      {selected.length > 0 && (
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs text-slate-500">Selected:</span>
          {selected.map((s) => (
            <span
              key={s}
              onClick={() => toggle(s)}
              className="cursor-pointer text-xs bg-[#00e5ff15] text-[#00e5ff] border border-[#00e5ff30] px-2 py-0.5 rounded-full flex items-center gap-1 hover:bg-[#ff4d6d15] hover:text-[#ff4d6d] hover:border-[#ff4d6d30] transition-all"
            >
              {formatLabel(s)} <span className="text-[10px]">×</span>
            </span>
          ))}
          <button onClick={() => onChange([])} className="text-xs text-slate-500 hover:text-[#ff4d6d] ml-auto">
            Clear all
          </button>
        </div>
      )}

      {/* Symptom Groups */}
      <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
        {filteredGroups.map(({ group, items }) => (
          <div key={group} className="border border-[#1e293b] rounded-xl overflow-hidden">
            <button
              onClick={() => toggleGroup(group)}
              className="w-full flex items-center justify-between px-4 py-2.5 bg-[#111827] text-sm font-medium text-slate-300 hover:text-white transition-colors"
            >
              <span>{group}</span>
              <span className="text-slate-500 text-xs">{openGroups[group] ? "▲" : "▼"}</span>
            </button>

            {(openGroups[group] || search) && (
              <div className="p-3 flex flex-wrap gap-2">
                {items.map((symptom) => {
                  const isSelected = selected.includes(symptom);
                  return (
                    <button
                      key={symptom}
                      onClick={() => toggle(symptom)}
                      className={`text-xs px-3 py-1.5 rounded-full border transition-all duration-150 font-medium ${
                        isSelected
                          ? "bg-[#00e5ff] text-[#0a0f1e] border-[#00e5ff]"
                          : "bg-transparent text-slate-400 border-[#1e293b] hover:border-[#00e5ff50] hover:text-white"
                      }`}
                    >
                      {formatLabel(symptom)}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
