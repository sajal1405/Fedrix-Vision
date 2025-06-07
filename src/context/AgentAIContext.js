import React, { createContext } from "react";
import PropTypes from "prop-types";

export const AgentAIContext = createContext({ generated: "" });

export const AgentAIProvider = ({ children, generated = "" }) => (
  <AgentAIContext.Provider value={{ generated }}>
    {children}
  </AgentAIContext.Provider>
);

AgentAIProvider.propTypes = {
  children: PropTypes.node.isRequired,
  generated: PropTypes.string,
};

export default AgentAIContext;
