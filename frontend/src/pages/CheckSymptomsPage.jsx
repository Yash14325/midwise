import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DurationPicker from "../components/DurationPicker";
import Navbar from "../components/Navbar";
import SeveritySlider from "../components/SeveritySlider";
import Sidebar from "../components/Sidebar";
import SymptomSelector from "../components/SymptomSelector";
import { useAuth } from "../hooks/useAuth";
import { useSymptomCheck } from "../hooks/useSymptomCheck";

const STEPS = ["Select Symptoms", "Context", "Confirm & Analyze"];

export default function CheckSymptomsPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { predict, loading, error } = useSymptomCheck();

  const [step, setStep] = useState(0);
  const [symptoms, setSymptoms] = useState([]);
  const [severity, setSeverity] = useState(5);
  const [duration, setDuration] = useState(3);
  const [notes, setNotes] = useState("");
  const [age, setAge] = useState(25);

  const canNext = () => {
    if (step === 0) return symptoms.length > 0;
    if (step === 1) return true;
    return true;
  };

  const handleAnalyze = async () => {
    try {
      const result = await predict({ symptoms, severity, duration_days: duration, age, notes });
      navigate(`/results/${result.check_id || "latest"}`, { state: { result } });
    } catch (_) {}
  };

  return (
    <div className="min-h-screen bg-[#0a0f1e] grid-bg">
      <Navbar />
      <Sidebar />

      <main className="lg:pl-60 pt-16">
        <div className="max-w-3xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="font-display text-2xl font-bold text-white">Symptom Check</h1>
            <p className="text-slate-500 text-sm mt-1">Tell us what you're experiencing</p>
          </div>

          {/* Step Indicator */}
          <div className="flex items-center gap-0 mb-8">
            {STEPS.map((s, i) => (
              <div key={s} className="flex items-center flex-1">
                <div className={`flex items-center gap-2 ${i <= step ? "text-[#00e5ff]" : "text-slate-600"}`}>
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold font-mono border transition-all ${
                    i < step ? "bg-[#00e5ff] border-[#00e5ff] text-[#0a0f1e]"
                    : i === step ? "border-[#00e5ff] text-[#00e5ff] bg-[#00e5ff15]"
                    : "border-[#1e293b] text-slate-600"
                  }`}>
                    {i < step ? "✓" : i + 1}
                  </div>
                  <span className="text-xs font-medium hidden sm:block">{s}</span>
                </div>
                {i < STEPS.length - 1 && (
                  <div className={`flex-1 h-px mx-3 transition-all ${i < step ? "bg-[#00e5ff]" : "bg-[#1e293b]"}`} />
                )}
              </div>
            ))}
          </div>

          {/* Step Content */}
          <div className="glass rounded-2xl border border-[#1e293b] p-6 min-h-[400px]">
            {step === 0 && (
              <div>
                <h2 className="font-display font-semibold text-white mb-1">What symptoms are you experiencing?</h2>
                <p className="text-sm text-slate-500 mb-5">Select all that apply. Be as specific as possible.</p>
                <SymptomSelector selected={symptoms} onChange={setSymptoms} />
                {symptoms.length === 0 && (
                  <p className="text-xs text-slate-600 mt-4">Please select at least one symptom to continue.</p>
                )}
              </div>
            )}

            {step === 1 && (
              <div className="space-y-8">
                <div>
                  <h2 className="font-display font-semibold text-white mb-1">Tell us more context</h2>
                  <p className="text-sm text-slate-500 mb-6">This helps our AI make better predictions.</p>
                </div>

                <div>
                  <SeveritySlider value={severity} onChange={setSeverity} />
                </div>

                <div className="border-t border-[#1e293b] pt-6">
                  <DurationPicker value={duration} onChange={setDuration} />
                </div>

                <div className="border-t border-[#1e293b] pt-6">
                  <label className="block text-sm text-slate-400 mb-1 font-medium">Your Age</label>
                  <input
                    type="number" value={age} onChange={(e) => setAge(Number(e.target.value))}
                    min={1} max={120} placeholder="Age in years"
                    className="w-32 bg-[#0a0f1e] border border-[#1e293b] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#00e5ff] transition-colors"
                  />
                </div>

                <div className="border-t border-[#1e293b] pt-6">
                  <label className="block text-sm text-slate-400 mb-1 font-medium">Additional Notes <span className="text-slate-600 font-normal">(optional)</span></label>
                  <textarea
                    value={notes} onChange={(e) => setNotes(e.target.value)}
                    placeholder="Any other details... (e.g. I had a cold last week, recently traveled, etc.)"
                    rows={3}
                    className="w-full bg-[#0a0f1e] border border-[#1e293b] rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-[#00e5ff] transition-colors resize-none"
                  />
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <div>
                  <h2 className="font-display font-semibold text-white mb-1">Review & Analyze</h2>
                  <p className="text-sm text-slate-500">Confirm your inputs before AI analysis.</p>
                </div>

                <div className="space-y-3">
                  <ReviewRow label="Symptoms" value={
                    <div className="flex flex-wrap gap-1 justify-end">
                      {symptoms.map((s) => (
                        <span key={s} className="text-xs bg-[#00e5ff15] text-[#00e5ff] border border-[#00e5ff30] px-2 py-0.5 rounded-full">
                          {s.replace(/_/g, " ")}
                        </span>
                      ))}
                    </div>
                  } />
                  <ReviewRow label="Severity" value={`${severity}/10`} />
                  <ReviewRow label="Duration" value={`${duration} day${duration > 1 ? "s" : ""}`} />
                  <ReviewRow label="Age" value={`${age} years`} />
                  {notes && <ReviewRow label="Notes" value={notes} />}
                </div>

                {error && (
                  <div className="p-4 rounded-xl bg-[#ff4d6d10] border border-[#ff4d6d30] text-sm text-[#ff4d6d]">
                    {error}
                  </div>
                )}

                <div className="p-4 rounded-xl bg-[#f59e0b08] border border-[#f59e0b20] flex gap-2">
                  <span className="text-[#f59e0b] flex-shrink-0">⚠</span>
                  <p className="text-xs text-slate-400">Results are AI-generated estimates. Consult a doctor for actual diagnosis.</p>
                </div>

                <button
                  onClick={handleAnalyze}
                  disabled={loading}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#00e5ff] to-[#7b2ff7] text-white font-display font-bold text-base hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <><span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> Analyzing with AI...</>
                  ) : (
                    "Analyze Symptoms →"
                  )}
                </button>
              </div>
            )}
          </div>

          {/* Navigation */}
          <div className="flex justify-between mt-5">
            <button
              onClick={() => step > 0 ? setStep(step - 1) : navigate("/dashboard")}
              className="px-5 py-2.5 rounded-xl border border-[#1e293b] text-slate-400 hover:text-white text-sm transition-colors"
            >
              ← {step === 0 ? "Dashboard" : "Back"}
            </button>
            {step < 2 && (
              <button
                onClick={() => setStep(step + 1)}
                disabled={!canNext()}
                className="px-6 py-2.5 rounded-xl bg-[#00e5ff15] text-[#00e5ff] border border-[#00e5ff30] text-sm font-medium hover:bg-[#00e5ff25] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Continue →
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

function ReviewRow({ label, value }) {
  return (
    <div className="flex items-start justify-between gap-4 py-2 border-b border-[#1e293b]">
      <span className="text-sm text-slate-500 flex-shrink-0">{label}</span>
      <div className="text-sm text-white text-right">{value}</div>
    </div>
  );
}
