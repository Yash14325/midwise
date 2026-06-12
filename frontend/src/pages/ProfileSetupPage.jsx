import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import api from "../services/api";

const DISEASE_OPTIONS = ["Diabetes", "Hypertension", "Thyroid", "Asthma", "Heart Disease", "Arthritis", "PCOD", "Kidney Disease", "Liver Disease", "Epilepsy"];
const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];
const GENDERS = ["Male", "Female", "Non-binary", "Prefer not to say"];

export default function ProfileSetupPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const fullName = user?.first_name ? `${user.first_name}${user.last_name ? ` ${user.last_name}` : ""}` : user?.email || "";
  const [form, setForm] = useState({
    full_name: fullName,
    age: "",
    gender: "",
    blood_group: "",
    phone_number: "",
    emergency_contact_name: "",
    emergency_contact_phone: "",
    previous_diseases: [],
    allergies: "",
    current_medications: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const update = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const toggleDisease = (d) => setForm((f) => ({
    ...f,
    previous_diseases: f.previous_diseases.includes(d)
      ? f.previous_diseases.filter((x) => x !== d)
      : [...f.previous_diseases, d],
  }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError("");
    try {
      const payload = {
        full_name: form.full_name,
        age: Number(form.age),
        gender: form.gender,
        blood_group: form.blood_group,
        phone_number: form.phone_number,
        emergency_contact_name: form.emergency_contact_name,
        emergency_contact_phone: form.emergency_contact_phone,
        previous_diseases_input: form.previous_diseases,
        allergies_input: form.allergies.split(",").map((s) => s.trim()).filter(Boolean),
        current_medications_input: form.current_medications.split(",").map((s) => s.trim()).filter(Boolean),
      };
      await api.post("/profile/create/", payload);
      navigate("/dashboard");
    } catch (err) {
      const details = err.response?.data;
      const message = details?.detail || details?.error || details?.message || "Failed to save profile. Try again.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0f1e] grid-bg px-4 py-16">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#00e5ff25] bg-[#00e5ff08] text-[#00e5ff] text-xs font-mono mb-4">
            Step 1 of 1 — Profile Setup
          </div>
          <h1 className="font-display text-3xl font-bold text-white mb-2">Tell us about yourself</h1>
          <p className="text-slate-400 text-sm">This helps our AI provide more accurate predictions for you.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Info */}
          <div className="glass rounded-2xl border border-[#1e293b] p-6 space-y-4">
            <h2 className="font-display font-semibold text-white text-sm uppercase tracking-widest text-[#00e5ff]">Personal Information</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="Full Name" required>
                <input type="text" value={form.full_name} onChange={update("full_name")} required placeholder="Your name" className={inputCls} />
              </Field>
              <Field label="Age" required>
                <input type="number" value={form.age} onChange={update("age")} required min={1} max={120} placeholder="Your age" className={inputCls} />
              </Field>
              <Field label="Gender">
                <select value={form.gender} onChange={update("gender")} className={inputCls}>
                  <option value="">Select gender</option>
                  {GENDERS.map((g) => <option key={g}>{g}</option>)}
                </select>
              </Field>
              <Field label="Blood Group">
                <select value={form.blood_group} onChange={update("blood_group")} className={inputCls}>
                  <option value="">Select blood group</option>
                  {BLOOD_GROUPS.map((b) => <option key={b}>{b}</option>)}
                </select>
              </Field>
            </div>
          </div>

          {/* Contact */}
          <div className="glass rounded-2xl border border-[#1e293b] p-6 space-y-4">
            <h2 className="font-display font-semibold text-sm uppercase tracking-widest text-[#7b2ff7]">Contact & Emergency</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="Phone Number">
                <input type="tel" value={form.phone_number} onChange={update("phone_number")} placeholder="+91 XXXXX XXXXX" className={inputCls} />
              </Field>
              <div /> {/* spacer */}
              <Field label="Emergency Contact Name">
                <input type="text" value={form.emergency_contact_name} onChange={update("emergency_contact_name")} placeholder="Contact name" className={inputCls} />
              </Field>
              <Field label="Emergency Contact Phone">
                <input type="tel" value={form.emergency_contact_phone} onChange={update("emergency_contact_phone")} placeholder="+91 XXXXX XXXXX" className={inputCls} />
              </Field>
            </div>
          </div>

          {/* Medical History */}
          <div className="glass rounded-2xl border border-[#1e293b] p-6 space-y-4">
            <h2 className="font-display font-semibold text-sm uppercase tracking-widest text-[#ff4d6d]">Medical History</h2>

            <Field label="Previous / Existing Diseases">
              <div className="flex flex-wrap gap-2 mt-1">
                {DISEASE_OPTIONS.map((d) => {
                  const selected = form.previous_diseases.includes(d);
                  return (
                    <button
                      key={d} type="button" onClick={() => toggleDisease(d)}
                      className={`text-sm px-3 py-1.5 rounded-full border transition-all ${
                        selected
                          ? "bg-[#ff4d6d] text-white border-[#ff4d6d]"
                          : "bg-transparent text-slate-400 border-[#1e293b] hover:border-[#ff4d6d50]"
                      }`}
                    >
                      {d}
                    </button>
                  );
                })}
              </div>
            </Field>

            <Field label="Allergies" hint="Comma-separated, e.g. Penicillin, Peanuts">
              <input type="text" value={form.allergies} onChange={update("allergies")} placeholder="Penicillin, Dust, Peanuts..." className={inputCls} />
            </Field>

            <Field label="Current Medications" hint="Comma-separated">
              <input type="text" value={form.current_medications} onChange={update("current_medications")} placeholder="Metformin 500mg, Aspirin..." className={inputCls} />
            </Field>
          </div>

          {error && (
            <div className="p-4 rounded-xl bg-[#ff4d6d10] border border-[#ff4d6d30] text-sm text-[#ff4d6d]">{error}</div>
          )}

          <button
            type="submit" disabled={loading}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#00e5ff] to-[#7b2ff7] text-white font-display font-bold text-base hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Saving...</> : "Complete Setup →"}
          </button>

          <button type="button" onClick={() => navigate("/dashboard")} className="w-full text-center text-sm text-slate-600 hover:text-slate-400 transition-colors">
            Skip for now
          </button>
        </form>
      </div>
    </div>
  );
}

const inputCls = "w-full bg-[#0a0f1e] border border-[#1e293b] rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-[#00e5ff] transition-colors";

function Field({ label, children, required, hint }) {
  return (
    <div>
      <label className="block text-xs text-slate-400 mb-1.5 font-medium">
        {label} {required && <span className="text-[#ff4d6d]">*</span>}
        {hint && <span className="text-slate-600 font-normal ml-1">({hint})</span>}
      </label>
      {children}
    </div>
  );
}
