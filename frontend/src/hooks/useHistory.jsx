import { useState, useEffect } from "react";
import api from "../services/api";

export function useHistory() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchHistory = async (pageNum = 1) => {
    setLoading(true);
    try {
      const { data } = await api.get(`/history/?page=${pageNum}`);
      if (pageNum === 1) {
        setHistory(data.results || data);
      } else {
        setHistory((prev) => [...prev, ...(data.results || data)]);
      }
      setHasMore(!!data.next);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load history.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory(1);
  }, []);

  const loadMore = () => {
    const next = page + 1;
    setPage(next);
    fetchHistory(next);
  };

  const deleteRecord = async (id) => {
    await api.delete(`/history/${id}/`);
    setHistory((prev) => prev.filter((h) => h.id !== id));
  };

  const getRecord = async (id) => {
    const { data } = await api.get(`/history/${id}/`);
    return data;
  };

  return { history, loading, error, hasMore, loadMore, deleteRecord, getRecord, refetch: () => fetchHistory(1) };
}
