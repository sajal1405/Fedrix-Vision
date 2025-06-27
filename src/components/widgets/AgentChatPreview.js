// src/components/widgets/AgentChatPreview.js
import React from 'react';
import { FaRobot } from 'react-icons/fa';

const AgentChatPreview = ({ text }) => {
  return (
    <div className="glassy-tile rounded-3xl p-7 shadow-xl border border-cyan-200/20 bg-gradient-to-br from-cyan-900/60 via-blue-900/30 to-cyan-800/50 backdrop-blur-lg relative overflow-hidden animate-fade-in">
      <div className="flex items-center gap-3 mb-3">
        <FaRobot className="text-cyan-300 text-2xl animate-glow" />
        <span className="text-lg font-semibold text-cyan-100">Agent Chat Preview</span>
      </div>
      <div className="text-white/90 font-medium text-[1.11rem] min-h-[36px]">{text}</div>
    </div>
  );
};

export default AgentChatPreview;
