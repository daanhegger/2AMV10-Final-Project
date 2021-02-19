import React from "react";
import useAxios from "axios-hooks";

function App() {
  const [{ data, loading, error }] = useAxios("http://localhost:5000");

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error!</p>;

  return <div className="App">{data}</div>;
}

export default App;
