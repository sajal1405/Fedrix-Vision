import React, { useContext } from "react";
import { AgentAIContext } from "../context/AgentAIContext";

const AgentDashboard = () => {
  const { generated } = useContext(AgentAIContext);
  return (
    <div>
      <h2>Agent Dashboard</h2>
      {generated && <p data-testid="generated-content">{generated}</p>}
    </div>
  );
};

export default AgentDashboard;
