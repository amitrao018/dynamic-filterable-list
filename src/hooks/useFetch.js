import { useState, useEffect, useRef } from "react";

const cache = new Map();

export default function useFetch(url) {
  const [data, setData] = useState(cache.get(url) || null);
  const [loading, setLoading] = useState(!cache.has(url));
  const [error, setError] = useState(null);
  const controllerRef = useRef(null);

  const fetchData = async () => {
    if (!url) return;
    if (cache.has(url)) {
      setData(cache.get(url));
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      controllerRef.current = new AbortController();
      const res = await fetch(url, { signal: controllerRef.current.signal });
      if (!res.ok) throw new Error("Network error");
      const json = await res.json();
      cache.set(url, json);
      setData(json);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    return () => controllerRef.current?.abort();
  }, [url]);

  const retry = () => fetchData();

  return { data, error, loading, retry };
}
