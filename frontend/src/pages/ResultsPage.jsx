import { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import api from "../services/api";

const SEVERITY_STYLE = {
  Mild: { color: "#22c55e", bg: "#22c55e10", border: "#22c55e30" },
  Moderate: { color: "#f59e0b", bg: "#f59e0b10", border: "#f59e0b30" },
  Severe: { color: "#ef4444", bg: "#ef444410", border: "#ef444430" },
  Critical: { color: "#ff4d6d", bg: "#ff4d6d10", border: "#ff4d6d30" },
};

export default function ResultsPage() {
  const { checkId } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();
  const [result, setResult] = useState(state?.result || null);
  const [loading, setLoading] = useState(!state?.result);

  useEffect(() => {
    if (!result && checkId !== "latest") {
      api.get(`/history/${checkId}/`).then(({ data }) => setResult(data)).finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [checkId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0f1e] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-[#00e5ff] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-400 text-sm font-mono">Loading results...</p>
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="min-h-screen bg-[#0a0f1e] flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-400 mb-4">Result not found.</p>
          <button onClick={() => navigate("/history")} className="text-[#00e5ff] hover:underline text-sm">Go to History</button>
        </div>
      </div>
    );
  }

  const confidence = Math.round((result.confidence || result.confidence_score || 0) * 100);
  const style = SEVERITY_STYLE[result.severity_label] || SEVERITY_STYLE.Mild;
  const isEmergency = result.emergency_flag || result.severity >= 9;

  return (
    <div className="min-h-screen bg-[#0a0f1e] grid-bg">
      <Navbar />
      <Sidebar />

      <main className="lg:pl-60 pt-16">
        <div className="max-w-3xl mx-auto px-4 py-8">
          {/* Emergency Banner */}
          {isEmergency && (
            <div className="mb-6 p-4 rounded-2xl border border-[#ff4d6d] bg-[#ff4d6d15] flex items-center gap-3 animate-pulse">
              <span className="text-2xl">🚨</span>
              <div>
                <p className="font-display font-bold text-[#ff4d6d]">Emergency Warning</p>
                <p className="text-sm text-slate-300">Symptoms appear critical. Call emergency services immediately: <strong>108</strong></p>
              </div>
            </div>
          )}

          {/* Primary Prediction */}
          <div className="glass rounded-2xl border border-[#00e5ff30] p-6 mb-5 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-[#00e5ff] opacity-[0.03] rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="relative z-10">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <p className="text-xs text-[#00e5ff] font-mono uppercase tracking-widest mb-1">Primary Prediction</p>
                  <h1 className="font-display text-3xl font-bold text-white">{result.predicted_disease || result.primary_prediction}</h1>
                </div>
                <span
                  className="text-sm font-semibold px-3 py-1 rounded-full flex-shrink-0"
                  style={{ color: style.color, background: style.bg, border: `1px solid ${style.border}` }}
                >
                  {result.severity_label}
                </span>
              </div>

              {/* Confidence Bar */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">Confidence</span>
                  <span className="font-mono font-bold text-[#00e5ff]">{confidence}%</span>
                </div>
                <div className="h-2 rounded-full bg-[#1e293b] overflow-hidden">
                  <div
                    className="h-2 rounded-full bg-gradient-to-r from-[#00e5ff] to-[#7b2ff7] transition-all duration-1000"
                    style={{ width: `${confidence}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Other Predictions */}
          {result.all_predictions?.length > 1 && (
            <div className="glass rounded-2xl border border-[#1e293b] p-5 mb-5">
              <p className="text-xs text-slate-500 font-mono uppercase tracking-widest mb-4">Other Possibilities</p>
              <div className="space-y-3">
                {result.all_predictions.slice(1, 4).map((p) => {
                  const pct = Math.round((p.confidence || p.score || 0) * 100);
                  return (
                    <div key={p.disease} className="flex items-center gap-3">
                      <span className="text-sm text-slate-400 w-32 flex-shrink-0 truncate">{p.disease}</span>
                      <div className="flex-1 h-1.5 bg-[#1e293b] rounded-full overflow-hidden">
                        <div className="h-1.5 bg-[#7b2ff7] rounded-full" style={{ width: `${pct}%` }} />
                      </div>
                      <span className="text-xs font-mono text-slate-500 w-10 text-right">{pct}%</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Recommended Tablets */}
          {result.recommended_tablets?.length > 0 && (
            <div className="glass rounded-2xl border border-[#1e293b] p-5 mb-5">
              <p className="text-xs text-[#00e5ff] font-mono uppercase tracking-widest mb-4">Recommended Medicines</p>
              <div className="grid sm:grid-cols-2 gap-3">
                {result.recommended_tablets.map((t, i) => (
                  <div key={i} className="bg-[#0a0f1e] rounded-xl p-3 border border-[#1e293b]">
                    <p className="font-semibold text-white text-sm">{t.name}</p>
                    <p className="text-xs text-[#00e5ff] font-mono mt-0.5">{t.dosage}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{t.frequency}</p>
                  </div>
                ))}
              </div>
              <p className="text-xs text-slate-600 mt-3">⚠ Always consult a pharmacist or doctor before taking any medication.</p>
            </div>
          )}

          {/* Home Remedies */}
          {result.home_remedies?.length > 0 && (
            <div className="glass rounded-2xl border border-[#22c55e25] p-5 mb-5">
              <p className="text-xs text-[#22c55e] font-mono uppercase tracking-widest mb-4">Home Remedies</p>
              <ul className="space-y-2">
                {result.home_remedies.map((r, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                    <span className="text-[#22c55e] flex-shrink-0 mt-0.5">◆</span>
                    {r}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Doctor Recommendation */}
          {result.doctor_recommendation && (
            <div className="glass rounded-2xl border border-[#7b2ff730] p-5 mb-5">
              <p className="text-xs text-[#7b2ff7] font-mono uppercase tracking-widest mb-2">Doctor's Advice</p>
              <p className="text-sm text-slate-300 leading-relaxed">{result.doctor_recommendation}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => navigate("/check")}
              className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-[#00e5ff] to-[#7b2ff7] text-white font-display font-semibold text-sm hover:opacity-90 transition-opacity"
            >
              New Check
            </button>
            <button
              onClick={() => navigate("/history")}
              className="px-5 py-2.5 rounded-xl border border-[#1e293b] text-slate-400 hover:text-white text-sm transition-colors"
            >
              View History
            </button>
            <button
              onClick={() => window.print()}
              className="px-5 py-2.5 rounded-xl border border-[#1e293b] text-slate-400 hover:text-white text-sm transition-colors"
            >
              Save / Print
            </button>
          </div>

          {/* Disclaimer */}
          <div className="mt-6 p-4 rounded-xl border border-[#f59e0b20] bg-[#f59e0b05] flex gap-2">
            <span className="text-[#f59e0b] text-xs flex-shrink-0">⚠</span>
            <p className="text-xs text-slate-500">This tool is for informational purposes only and is not a substitute for professional medical advice. Always consult a qualified healthcare provider for diagnosis and treatment.</p>
          </div>
        </div>
      </main>
    </div>
  );
}
