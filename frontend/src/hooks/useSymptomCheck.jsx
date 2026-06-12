import { useState } from "react";
import api from "../services/api";

export function useSymptomCheck() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const predict = async ({ symptoms, severity, duration_days, age, notes = "" }) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.post("/symptoms/predict/", {
        symptoms,
        severity,
        duration_days,
        age,
        notes,
      });
      setResult(data);
      return data;
    } catch (err) {
      setError(err.response?.data?.message || "Prediction failed. Please try again.");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getSymptomList = async () => {
    const { data } = await api.get("/symptoms/list/");
    return data;
  };

  const reset = () => {
    setResult(null);
    setError(null);
  };

  return { predict, getSymptomList, result, loading, error, reset };
}
