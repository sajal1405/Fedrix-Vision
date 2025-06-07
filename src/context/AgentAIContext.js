
import React, { createContext, useState } from "react";
import PropTypes from "prop-types";

export const AgentAIContext = createContext({
  generated: "",
  loading: false,
  generateContent: async () => "",
});

export const AgentAIProvider = ({ children, generated: initialGenerated = "" }) => {
  const [generated, setGenerated] = useState(initialGenerated);
  const [loading, setLoading] = useState(false);

  const generateContent = async (prompt) => {
    const apiUrl = process.env.REACT_APP_HF_API_URL;
    if (!apiUrl) {
      console.error(
        "REACT_APP_HF_API_URL is not set. Skipping AI content generation."
      );
      return "";
    }
    setLoading(true);
    try {
      const res = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ inputs: prompt }),
      });
      const data = await res.json();
      const text = Array.isArray(data)
        ? data[0]?.generated_text || ""
        : data.generated_text || data;
      setGenerated(text);
      return text;
    } catch (err) {
      console.error("generateContent failed", err);
      return "";
    } finally {
      setLoading(false);
    }
  };

  return (
    <AgentAIContext.Provider value={{ generated, loading, generateContent }}>
      {children}
    </AgentAIContext.Provider>
  );
};

AgentAIProvider.propTypes = {
  children: PropTypes.node.isRequired,
  generated: PropTypes.string,
};

export default AgentAIContext;

