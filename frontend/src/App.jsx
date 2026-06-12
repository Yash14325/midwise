import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./hooks/useAuth";
import AboutPage from "./pages/AboutPage";
import AuthPage from "./pages/AuthPage";
import ProfileSetupPage from "./pages/ProfileSetupPage";
import DashboardPage from "./pages/Dashboard";
import CheckSymptomsPage from "./pages/CheckSymptomsPage";
import ResultsPage from "./pages/ResultsPage";
import HistoryPage from "./pages/HistoryPage";
import ScanPrescriptionPage from "./pages/ScanPrescriptionPage";
import AIAssistantPage from "./pages/AIAssistantPage";

function PrivateRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="min-h-screen flex items-center justify-center bg-[#0a0f1e]"><div className="w-8 h-8 border-2 border-[#00e5ff] border-t-transparent rounded-full animate-spin" /></div>;
  return user ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AboutPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/login" element={<AuthPage />} />
        <Route path="/signup" element={<AuthPage />} />
        <Route path="/profile-setup" element={<PrivateRoute><ProfileSetupPage /></PrivateRoute>} />
        <Route path="/dashboard" element={<PrivateRoute><DashboardPage /></PrivateRoute>} />
        <Route path="/check" element={<PrivateRoute><CheckSymptomsPage /></PrivateRoute>} />
        <Route path="/results/:checkId" element={<PrivateRoute><ResultsPage /></PrivateRoute>} />
        <Route path="/history" element={<PrivateRoute><HistoryPage /></PrivateRoute>} />
        <Route path="/scan" element={<PrivateRoute><ScanPrescriptionPage /></PrivateRoute>} />
        <Route path="/assistant" element={<PrivateRoute><AIAssistantPage /></PrivateRoute>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}
