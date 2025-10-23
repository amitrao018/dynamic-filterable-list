import React from "react";
import useFetch from "../hooks/useFetch";
import "../styles.css";

export default function PostList() {
  const { data, error, loading, retry } = useFetch("https://httpbin.org/delay/2?query=abcd");

  return (
    <div className="container">
      <h2>📰 Post List</h2>
      {loading && <p>Loading...</p>}
      {error && (
        <div>
          <p>Error: {error}</p>
          <button onClick={retry}>Retry</button>
        </div>
      )}
      {data && (
        <pre>{JSON.stringify(data, null, 2)}</pre>
      )}
    </div>
  );
}

