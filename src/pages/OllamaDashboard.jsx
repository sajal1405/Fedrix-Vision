// src/pages/OllamaDashboard.jsx
import React, { useState, useEffect } from 'react';
import { FaBars } from 'react-icons/fa';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion'; // Still here for potential future use or if other motion elements are added

import supabase from '../utils/supabase';

// Ollama-specific components
// eslint-disable-next-line no-unused-vars
import ChatSidebar from '../components/ollama/ChatSidebar'; // Sidebar might be reintroduced or its logic moved
import ModelStatusIndicator from '../components/ollama/ModelStatusIndicator';
import ChatWindow from '../components/ollama/ChatWindow';
import { useAuth } from '../context/AuthContext';

const OllamaDashboard = () => {
  const { currentUser, isLoading: authLoading } = useAuth();
  const userId = currentUser?.id;

  // eslint-disable-next-line no-unused-vars
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); // Retain for consistency with sidebar context if needed
  const [currentSessionId, setCurrentSessionId] = useState(null); // This state will eventually be managed by ChatSidebar or a dedicated context
  const [ollamaModels, setOllamaModels] = useState([
    { id: 'codellama', name: 'Vision Developer AI', status: 'inactive' },
    { id: 'qwen', name: 'Vision Creator AI', status: 'inactive' },
    { id: 'llama2', name: 'Llama 2', status: 'inactive' }, // Added a common default
  ]);

  // Fetch and update Ollama model statuses with display names
  useEffect(() => {
    const fetchAndSetOllamaModels = async () => {
      try {
        const response = await fetch('http://localhost:11434/api/tags');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        const fetchedModels = data.models.map((model) => {
          const modelName = model.name.split(':')[0];
          // Map to desired display names
          if (modelName === 'codellama') {
            return {
              id: modelName,
              name: 'Vision Developer AI',
              status: 'active',
            };
          } else if (modelName === 'qwen') {
            return {
              id: modelName,
              name: 'Vision Creator AI',
              status: 'active',
            };
          }
          return { id: modelName, name: modelName, status: 'active' }; // Fallback for other models
        });

        setOllamaModels((prevModels) => {
          const updatedModels = prevModels.map((prevModel) => {
            const fetched = fetchedModels.find((fm) => fm.id === prevModel.id);
            return fetched
              ? { ...prevModel, status: fetched.status }
              : { ...prevModel, status: 'inactive' };
          });
          fetchedModels.forEach((fm) => {
            if (!updatedModels.some((um) => um.id === fm.id)) {
              updatedModels.push(fm);
            }
          });
          return updatedModels;
        });
      } catch (error) {
        console.error('Failed to fetch Ollama models:', error);
        setOllamaModels((prevModels) =>
          prevModels.map((model) => ({ ...model, status: 'inactive' })),
        );
      }
    };

    fetchAndSetOllamaModels();
    const interval = setInterval(fetchAndSetOllamaModels, 10000); // Poll every 10 seconds
    return () => clearInterval(interval);
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  if (authLoading || !userId) {
    return (
      <div className="flex items-center justify-center min-h-screen-content text-off-white">
        <p>Initializing Agent Dashboard...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full flex-grow relative overflow-hidden p-6 md:p-8">
      {/* Header for Ollama Dashboard (Integrated status indicators) */}
      <header className="flex-shrink-0 flex items-center justify-between py-3 px-6 bg-dark-gray shadow-lg z-30 rounded-xl mb-4 border border-mid-gray">
        <div className="flex items-center">
          {/* This toggle button is more for visual consistency; actual sidebar toggle is in main Header */}
          <button
            onClick={toggleSidebar}
            className="lg:hidden text-light-gray text-xl p-2 mr-4 rounded-md hover:bg-mid-gray transition-colors"
            aria-label="Toggle sidebar"
          >
            <FaBars />
          </button>
          <span className="text-xl font-bold text-off-white">
            Agent Status:
          </span>
          <div className="flex items-center space-x-4 ml-4">
            {ollamaModels.map((model) => (
              <ModelStatusIndicator key={model.id} model={model} />
            ))}
          </div>
        </div>

        <span className="text-sm text-white/50">
          User ID: {userId || 'N/A'}
        </span>
      </header>

      {/* Main Chat Window - This component will now manage its own sessions */}
      {/* The ChatSidebar is currently not directly rendered here, its functionality can be integrated into ChatWindow or manage via a context. */}
      <ChatWindow
        userId={userId}
        supabase={supabase}
        currentSessionId={currentSessionId} // Passed down for message fetching
        setCurrentSessionId={setCurrentSessionId} // Passed down so ChatWindow can manage sessions
        ollamaModels={ollamaModels}
      />
    </div>
  );
};

export default OllamaDashboard;
