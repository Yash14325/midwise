import { useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import PrescriptionScanner from "../components/PrescriptionScanner";

export default function ScanPrescriptionPage() {
  const [result, setResult] = useState(null);

  return (
    <div className="min-h-screen bg-[#0a0f1e] grid-bg">
      <Navbar />
      <Sidebar />

      <main className="lg:pl-60 pt-16">
        <div className="max-w-2xl mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="font-display text-2xl font-bold text-white">Prescription Scanner</h1>
            <p className="text-slate-500 text-sm mt-1">Upload a prescription image for AI-powered medicine analysis</p>
          </div>

          <div className="glass rounded-2xl border border-[#1e293b] p-6 mb-6">
            <PrescriptionScanner onResult={setResult} />
          </div>

          {/* Results */}
          {result && (
            <div className="space-y-4">
              {/* OCR Text */}
              {result.ocr_text && (
                <div className="glass rounded-2xl border border-[#1e293b] p-5">
                  <p className="text-xs text-slate-500 font-mono uppercase tracking-widest mb-3">Extracted Text (OCR)</p>
                  <pre className="text-xs text-slate-400 font-mono whitespace-pre-wrap leading-relaxed bg-[#0a0f1e] rounded-xl p-4 border border-[#1e293b] max-h-48 overflow-y-auto">
                    {result.ocr_text}
                  </pre>
                </div>
              )}

              {/* Analyzed Medicines */}
              {result.analyzed_medicines?.length > 0 && (
                <div className="glass rounded-2xl border border-[#00e5ff25] p-5">
                  <p className="text-xs text-[#00e5ff] font-mono uppercase tracking-widest mb-4">Identified Medicines</p>
                  <div className="space-y-4">
                    {result.analyzed_medicines.map((med, i) => (
                      <div key={i} className="bg-[#0a0f1e] rounded-xl p-4 border border-[#1e293b]">
                        <div className="flex items-start justify-between gap-3 mb-2">
                          <h3 className="font-display font-semibold text-white">{med.name}</h3>
                          {med.dosage && (
                            <span className="text-xs font-mono text-[#00e5ff] bg-[#00e5ff10] border border-[#00e5ff25] px-2 py-0.5 rounded-full flex-shrink-0">
                              {med.dosage}
                            </span>
                          )}
                        </div>
                        {med.purpose && (
                          <p className="text-sm text-slate-400 mb-2"><span className="text-slate-600">Purpose:</span> {med.purpose}</p>
                        )}
                        {med.sideEffects?.length > 0 && (
                          <div>
                            <p className="text-xs text-[#f59e0b] mb-1">Possible side effects:</p>
                            <div className="flex flex-wrap gap-1">
                              {med.sideEffects.map((s, j) => (
                                <span key={j} className="text-xs bg-[#f59e0b10] text-[#f59e0b] border border-[#f59e0b30] px-2 py-0.5 rounded-full">{s}</span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="p-4 rounded-xl border border-[#f59e0b20] bg-[#f59e0b05] flex gap-2">
                <span className="text-[#f59e0b] text-xs flex-shrink-0">⚠</span>
                <p className="text-xs text-slate-500">Medicine information is AI-generated. Always follow your doctor's instructions and consult a pharmacist for medication advice.</p>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
