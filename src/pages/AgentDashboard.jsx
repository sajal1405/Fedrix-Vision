import React, { useContext } from "react";
import { AgentAIContext } from "../context/AgentAIContext";

const AgentDashboard = () => {
  const { generated, generateContent, loading } = useContext(AgentAIContext);

  const handleGenerate = () => {
    generateContent("Hello from Fedrix");
  };
  return (
    <div>
      <h2>Agent Dashboard</h2>
      <button onClick={handleGenerate} disabled={loading}>
        {loading ? "Generating..." : "Generate"}
      </button>
      {generated && <p data-testid="generated-content">{generated}</p>}
    </div>
  );
};

export default AgentDashboard;
