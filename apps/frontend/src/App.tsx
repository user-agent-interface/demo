import { useState } from "react";

const UAI_SERVER_URL =
  import.meta.env.VITE_UAI_SERVER_URL || "http://localhost:3001";
const API_DB_URL = import.meta.env.VITE_API_DB_URL || "http://localhost:3002";

function App() {
  const [llmResponse, setLlmResponse] = useState<string>("");
  const [dbResponse, setDbResponse] = useState<string>("");

  const testLlmApi = async () => {
    try {
      const response = await fetch(`${UAI_SERVER_URL}/health`);
      const data = await response.json();
      setLlmResponse(JSON.stringify(data, null, 2));
    } catch (error) {
      setLlmResponse(
        `Error: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }
  };

  const testDbApi = async () => {
    try {
      const response = await fetch(`${API_DB_URL}/health`);
      const data = await response.json();
      setDbResponse(JSON.stringify(data, null, 2));
    } catch (error) {
      setDbResponse(
        `Error: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }
  };

  return (
    <div style={{ padding: "2rem", maxWidth: "1200px", margin: "0 auto" }}>
      <h1>UAI Demo Frontend</h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "2rem",
          marginTop: "2rem",
        }}
      >
        <div>
          <h2>LLM API</h2>
          <button
            onClick={testLlmApi}
            style={{ marginBottom: "1rem", padding: "0.5rem 1rem" }}
          >
            Test LLM API
          </button>
          <pre
            style={{
              background: "#f5f5f5",
              padding: "1rem",
              borderRadius: "4px",
              overflow: "auto",
            }}
          >
            {llmResponse || "No response yet"}
          </pre>
        </div>

        <div>
          <h2>DB API</h2>
          <button
            onClick={testDbApi}
            style={{ marginBottom: "1rem", padding: "0.5rem 1rem" }}
          >
            Test DB API
          </button>
          <pre
            style={{
              background: "#f5f5f5",
              padding: "1rem",
              borderRadius: "4px",
              overflow: "auto",
            }}
          >
            {dbResponse || "No response yet"}
          </pre>
        </div>
      </div>
    </div>
  );
}

export default App;
