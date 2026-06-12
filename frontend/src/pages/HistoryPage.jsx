import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import PredictionCard from "../components/PredictionCard";
import { useHistory } from "../hooks/useHistory.jsx";

const SEVERITY_FILTERS = ["All", "Mild", "Moderate", "Severe", "Critical"];

export default function HistoryPage() {
  const navigate = useNavigate();
  const { history, loading, hasMore, loadMore, deleteRecord } = useHistory();
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [deleteId, setDeleteId] = useState(null);

  const filtered = history.filter((h) => {
    const matchSeverity = filter === "All" || h.severity_label === filter;
    const matchSearch = !search || h.predicted_disease?.toLowerCase().includes(search.toLowerCase());
    return matchSeverity && matchSearch;
  });

  const handleDelete = async (id) => {
    await deleteRecord(id);
    setDeleteId(null);
  };

  return (
    <div className="min-h-screen bg-[#0a0f1e] grid-bg">
      <Navbar />
      <Sidebar />

      <main className="lg:pl-60 pt-16">
        <div className="max-w-3xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="font-display text-2xl font-bold text-white">Health History</h1>
              <p className="text-slate-500 text-sm mt-0.5">{history.length} total checks</p>
            </div>
            <button
              onClick={() => navigate("/check")}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#00e5ff] to-[#7b2ff7] text-white font-display font-semibold text-sm hover:opacity-90 transition-opacity"
            >
              + New Check
            </button>
          </div>

          {/* Filters */}
          <div className="glass rounded-2xl border border-[#1e293b] p-4 mb-6 space-y-3">
            {/* Search */}
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm">⌕</span>
              <input
                type="text" placeholder="Search by disease..." value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-[#0a0f1e] border border-[#1e293b] rounded-xl pl-9 pr-4 py-2 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-[#00e5ff] transition-colors"
              />
            </div>

            {/* Severity Filter */}
            <div className="flex flex-wrap gap-2">
              {SEVERITY_FILTERS.map((f) => (
                <button
                  key={f} onClick={() => setFilter(f)}
                  className={`text-xs px-3 py-1.5 rounded-full border transition-all font-medium ${
                    filter === f
                      ? "bg-[#00e5ff] text-[#0a0f1e] border-[#00e5ff]"
                      : "text-slate-400 border-[#1e293b] hover:border-[#00e5ff50] hover:text-white"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          {/* Results */}
          {loading && history.length === 0 ? (
            <div className="space-y-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-24 rounded-2xl bg-[#111827] animate-pulse" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-4xl mb-3">◷</p>
              <p className="font-display font-semibold text-white mb-1">No records found</p>
              <p className="text-sm text-slate-500 mb-4">
                {search || filter !== "All" ? "Try different filters." : "Start your first symptom check."}
              </p>
              {!search && filter === "All" && (
                <button onClick={() => navigate("/check")} className="text-sm text-[#00e5ff] hover:underline">
                  Check Symptoms →
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              {filtered.map((check) => (
                <div key={check.id} className="relative group">
                  <PredictionCard check={check} />
                  {/* Delete button */}
                  <button
                    onClick={(e) => { e.stopPropagation(); setDeleteId(check.id); }}
                    className="absolute top-3 right-3 w-7 h-7 rounded-lg bg-[#0a0f1e] border border-[#1e293b] text-slate-600 hover:text-[#ff4d6d] hover:border-[#ff4d6d50] transition-all opacity-0 group-hover:opacity-100 flex items-center justify-center text-xs"
                  >
                    ×
                  </button>
                </div>
              ))}

              {hasMore && (
                <button
                  onClick={loadMore}
                  className="w-full py-3 rounded-xl border border-[#1e293b] text-slate-400 hover:text-white hover:border-[#00e5ff50] text-sm transition-all"
                >
                  Load More
                </button>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Delete Confirm Modal */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <div className="glass rounded-2xl border border-[#1e293b] p-6 max-w-sm w-full">
            <h3 className="font-display font-bold text-white mb-2">Delete Record</h3>
            <p className="text-sm text-slate-400 mb-5">This action cannot be undone. Are you sure?</p>
            <div className="flex gap-3">
              <button
                onClick={() => handleDelete(deleteId)}
                className="flex-1 py-2 rounded-xl bg-[#ff4d6d] text-white font-semibold text-sm hover:bg-[#e63c5a] transition-colors"
              >
                Delete
              </button>
              <button
                onClick={() => setDeleteId(null)}
                className="flex-1 py-2 rounded-xl border border-[#1e293b] text-slate-400 text-sm hover:text-white transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
