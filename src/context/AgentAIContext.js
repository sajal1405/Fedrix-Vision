import React, { createContext, useState } from "react";
import PropTypes from "prop-types";

export const AgentAIContext = createContext();

export const AgentAIProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const apiUrl =
    process.env.REACT_APP_HF_API_URL ||
    "https://api-inference.huggingface.co/models/gpt2";

  const generateContent = async (prompt) => {
    setLoading(true);
    try {
      const res = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ inputs: prompt }),
      });
      const data = await res.json();
      const text = Array.isArray(data)
        ? data[0]?.generated_text
        : data.generated_text;
      return text || "";
    } catch (err) {
      console.error("AI generation failed", err);
      return "";
    } finally {
      setLoading(false);
    }
  };

  return (
    <AgentAIContext.Provider value={{ generateContent, loading }}>
      {children}
    </AgentAIContext.Provider>
  );
};

AgentAIProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
