import { useState, useRef } from "react";
import api from "../services/api";

export default function PrescriptionScanner({ onResult }) {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const inputRef = useRef();

  const handleFile = (f) => {
    if (!f) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
    setError(null);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const f = e.dataTransfer.files[0];
    if (f && f.type.startsWith("image/")) handleFile(f);
  };

  const handleScan = async () => {
    if (!file) return;
    setLoading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append("image", file);
      const { data } = await api.post("/prescriptions/scan/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      onResult?.(data);
    } catch (err) {
      setError(err.response?.data?.message || "Scan failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setFile(null);
    setPreview(null);
    setError(null);
  };

  return (
    <div className="space-y-4">
      {!preview ? (
        <div
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          onClick={() => inputRef.current?.click()}
          className="relative border-2 border-dashed border-[#1e293b] rounded-2xl p-10 text-center cursor-pointer hover:border-[#00e5ff50] transition-all group"
        >
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            capture="environment"
            className="hidden"
            onChange={(e) => handleFile(e.target.files[0])}
          />
          <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">⬙</div>
          <p className="font-display font-semibold text-white mb-1">Upload Prescription</p>
          <p className="text-sm text-slate-500">Drag & drop or click to browse</p>
          <p className="text-xs text-slate-600 mt-1">Supports JPG, PNG, HEIC</p>

          {/* Scan line animation */}
          <div className="absolute inset-0 overflow-hidden rounded-2xl opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity">
            <div className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#00e5ff] to-transparent animate-scan" />
          </div>
        </div>
      ) : (
        <div className="relative rounded-2xl overflow-hidden border border-[#1e293b]">
          <img src={preview} alt="Prescription" className="w-full max-h-64 object-cover" />
          <button
            onClick={reset}
            className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/70 text-white flex items-center justify-center hover:bg-[#ff4d6d] transition-colors text-sm"
          >
            ×
          </button>
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 p-3">
            <p className="text-xs text-slate-300 truncate">{file?.name}</p>
          </div>
        </div>
      )}

      {error && (
        <div className="p-3 rounded-xl bg-[#ff4d6d10] border border-[#ff4d6d30] text-sm text-[#ff4d6d]">
          {error}
        </div>
      )}

      <div className="flex gap-2">
        <button
          onClick={handleScan}
          disabled={!file || loading}
          className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-[#00e5ff] to-[#7b2ff7] text-[#0a0f1e] font-display font-semibold text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
              Analyzing...
            </>
          ) : (
            "Scan Prescription"
          )}
        </button>
        {preview && (
          <button
            onClick={reset}
            className="px-4 py-2.5 rounded-xl border border-[#1e293b] text-slate-400 hover:text-white text-sm transition-colors"
          >
            Reset
          </button>
        )}
      </div>
    </div>
  );
}
