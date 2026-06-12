import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

const FEATURES = [
  { icon: "◈", title: "Symptom Analysis", desc: "Select from 100+ symptoms. Our AI cross-references your age, duration, and severity to generate accurate predictions." },
  { icon: "◉", title: "AI Assistant", desc: "Chat with Claude-powered medical AI for in-depth explanations, second opinions, and health guidance." },
  { icon: "◷", title: "Health History", desc: "Every check is saved. Track patterns, monitor recurring symptoms, and export reports." },
  { icon: "⬙", title: "Prescription Scanner", desc: "Upload a prescription image. OCR extracts medicine names and AI explains purposes and side effects." },
];

const STEPS = [
  { step: "01", title: "Enter Symptoms", desc: "Select what you're experiencing from our curated symptom library, grouped by body system." },
  { step: "02", title: "AI Analysis", desc: "Our ML model + Claude AI analyzes your inputs against thousands of disease patterns." },
  { step: "03", title: "Get Results", desc: "Receive predicted conditions, recommended medicines, home remedies, and doctor guidance." },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#0a0f1e] grid-bg">
      <Navbar />

      {/* Hero */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        {/* Ambient glow blobs */}
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-[#00e5ff] opacity-[0.04] rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-40 right-1/4 w-80 h-80 bg-[#7b2ff7] opacity-[0.05] rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#00e5ff25] bg-[#00e5ff08] text-[#00e5ff] text-xs font-mono mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00e5ff] animate-pulse" />
            AI-Powered Health Intelligence
          </div>

          <h1 className="font-display text-5xl md:text-7xl font-bold text-white leading-tight mb-6">
            Your Symptoms,<br />
            <span className="gradient-text">Decoded by AI</span>
          </h1>

          <p className="text-lg text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            MediWise combines machine learning and Claude AI to analyze your symptoms, predict possible conditions, and guide you toward the right care — instantly and privately.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/signup"
              className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#00e5ff] to-[#7b2ff7] text-white font-display font-semibold text-base hover:opacity-90 transition-opacity"
            >
              Get Started Free →
            </Link>
            <Link
              to="/login"
              className="px-8 py-3.5 rounded-xl border border-[#1e293b] text-slate-300 font-medium text-base hover:border-[#00e5ff50] hover:text-white transition-all"
            >
              Log In
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <p className="text-center text-xs text-slate-500 uppercase tracking-widest font-mono mb-3">What MediWise Does</p>
          <h2 className="text-center font-display text-3xl font-bold text-white mb-12">Built for your health journey</h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {FEATURES.map((f) => (
              <div
                key={f.title}
                className="glass rounded-2xl p-6 border border-[#1e293b] hover:border-[#00e5ff30] transition-all hover:shadow-[0_0_30px_rgba(0,229,255,0.07)] group"
              >
                <div className="text-3xl mb-4 text-[#00e5ff] group-hover:scale-110 transition-transform inline-block">{f.icon}</div>
                <h3 className="font-display font-semibold text-white mb-2">{f.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <p className="text-center text-xs text-slate-500 uppercase tracking-widest font-mono mb-3">How It Works</p>
          <h2 className="text-center font-display text-3xl font-bold text-white mb-12">Three steps to clarity</h2>

          <div className="relative">
            <div className="absolute left-8 top-0 bottom-0 w-px bg-gradient-to-b from-[#00e5ff] via-[#7b2ff7] to-transparent hidden md:block" />
            <div className="space-y-8">
              {STEPS.map((s) => (
                <div key={s.step} className="flex gap-6 items-start">
                  <div className="flex-shrink-0 w-16 h-16 rounded-2xl bg-gradient-to-br from-[#00e5ff15] to-[#7b2ff715] border border-[#00e5ff25] flex items-center justify-center font-mono text-[#00e5ff] font-bold text-lg">
                    {s.step}
                  </div>
                  <div className="pt-3">
                    <h3 className="font-display font-semibold text-white text-lg mb-1">{s.title}</h3>
                    <p className="text-slate-400 text-sm leading-relaxed">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="py-10 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="p-5 rounded-2xl border border-[#f59e0b30] bg-[#f59e0b08] flex gap-3">
            <span className="text-[#f59e0b] text-lg flex-shrink-0 mt-0.5">⚠</span>
            <p className="text-xs text-slate-400 leading-relaxed">
              <span className="font-semibold text-[#f59e0b]">Medical Disclaimer: </span>
              MediWise is for informational purposes only and is not a substitute for professional medical advice, diagnosis, or treatment. Always consult a qualified healthcare provider for any medical concerns.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="font-display text-4xl font-bold text-white mb-4">Ready to understand your health?</h2>
          <p className="text-slate-400 mb-8">Join thousands who use MediWise for smarter health decisions.</p>
          <Link
            to="/signup"
            className="inline-block px-10 py-4 rounded-xl bg-gradient-to-r from-[#00e5ff] to-[#7b2ff7] text-white font-display font-bold text-base hover:opacity-90 transition-opacity"
          >
            Start For Free →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#1e293b] py-6 px-4 text-center">
        <p className="text-xs text-slate-600">© 2025 MediWise. Not a medical device. For informational use only.</p>
      </footer>
    </div>
  );
}
