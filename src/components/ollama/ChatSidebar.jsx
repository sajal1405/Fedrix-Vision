// src/components/ollama/ChatSidebar.jsx
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import { FaPlus, FaRegMessage, FaTrash, FaXmark } from 'react-icons/fa6';

import supabase from '../../utils/supabase'; // Adjusted import path for your setup

// Removed 'supabase' from props destructuring as it's imported directly
const ChatSidebar = ({
  userId,
  currentSessionId,
  setCurrentSessionId,
  toggleSidebar,
  ollamaModels,
}) => {
  const [sessions, setSessions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check if Supabase client is available and userId exists
    if (!supabase || !userId) {
      // Simulate loading if Supabase or userId is not ready
      setIsLoading(true);
      setError(null);
      const simulatedSessions = [
        {
          id: 'temp-dashboard',
          name: 'Temporary Chat (Dashboard)',
          is_temporary: true,
          last_updated: new Date().toISOString(),
        },
      ].sort(
        (a, b) =>
          new Date(b.last_updated).getTime() -
          new Date(a.last_updated).getTime(),
      );
      setSessions(simulatedSessions);
      setIsLoading(false);
      if (!currentSessionId && simulatedSessions.length > 0) {
        setCurrentSessionId(simulatedSessions[0].id);
      }
      return; // Exit early as Supabase is not ready
    }

    setIsLoading(true);
    setError(null);

    // Supabase real-time listener for chat_sessions
    const channel = supabase
      .channel(`public:chat_sessions_for_user_${userId}`) // Unique channel per user
      .on(
        'postgres_changes',
        {
          event: '*', // Listen for INSERT, UPDATE, DELETE
          schema: 'public',
          table: 'chat_sessions',
          filter: `user_id=eq.${userId}`, // Ensure RLS is active and filtering works
        },
        (payload) => {
          console.log('Supabase change detected:', payload);
          // Re-fetch or update state based on payload to reflect changes
          // For simplicity, let's re-fetch all sessions for this user on any change
          fetchSessions();
        },
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          console.log(`Subscribed to chat sessions for user: ${userId}`);
        } else if (status === 'CHANNEL_ERROR') {
          console.error(`Supabase channel error for user ${userId}:`, status);
          setError(new Error(`Realtime channel error: ${status}`));
        } else if (status === 'TIMED_OUT') {
          console.warn(`Supabase channel timed out for user ${userId}.`);
        }
      });

    const fetchSessions = async () => {
      try {
        const { data, error } = await supabase
          .from('chat_sessions')
          .select('*')
          .eq('user_id', userId)
          .order('last_updated', { ascending: false });

        if (error) throw error;

        setSessions(data);
        setIsLoading(false);

        if (!currentSessionId && data.length > 0) {
          setCurrentSessionId(data[0].id);
        } else if (
          currentSessionId &&
          !data.some((s) => s.id === currentSessionId)
        ) {
          setCurrentSessionId(data[0]?.id || null);
        }
      } catch (err) {
        console.error('Error fetching chat sessions from Supabase:', err);
        setError(err);
        setIsLoading(false);
      }
    };

    fetchSessions(); // Initial fetch

    return () => {
      // Unsubscribe from the channel when component unmounts
      supabase.removeChannel(channel);
    };
  }, [userId, currentSessionId, setCurrentSessionId]); // Removed 'supabase' from dependencies

  const handleNewChat = async () => {
    if (!supabase || !userId) {
      console.error(
        'Supabase client or userId not available to create new chat.',
      );
      setError(
        new Error('Supabase is not initialized. Cannot create new chat.'),
      );
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const newSessionName = `New Chat ${new Date().toLocaleString()}`;
      const defaultModelId =
        ollamaModels.find((m) => m.status === 'active')?.id || 'default';

      const { data, error } = await supabase
        .from('chat_sessions')
        .insert({
          user_id: userId,
          name: newSessionName,
          is_temporary: false,
          initial_model: defaultModelId,
        })
        .select() // Select the inserted row to get its ID
        .single(); // Expect a single row back

      if (error) throw error;

      setCurrentSessionId(data.id); // Set the newly created session as current
      // The useEffect listener will automatically update `sessions` state
    } catch (e) {
      console.error('Error creating new chat session in Supabase:', e);
      setError(e);
    } finally {
      setIsLoading(false);
    }
  };

  const selectSession = (sessionId) => {
    setCurrentSessionId(sessionId);
    if (window.innerWidth < 1024) {
      toggleSidebar();
    }
  };

  const deleteSession = async (sessionIdToDelete) => {
    const confirmDelete = window.confirm(
      'Are you sure you want to delete this chat session? This action cannot be undone.',
    );
    if (confirmDelete) {
      if (!supabase || !userId) {
        console.error(
          'Supabase client or userId not available to delete chat.',
        );
        setError(new Error('Supabase is not initialized. Cannot delete chat.'));
        return;
      }

      setIsLoading(true);
      setError(null);
      try {
        const { error } = await supabase
          .from('chat_sessions')
          .delete()
          .eq('id', sessionIdToDelete)
          .eq('user_id', userId); // Ensure only the user's own session can be deleted via RLS

        if (error) throw error;

        // The useEffect listener will automatically update `sessions` state
        // If the deleted session was current, switch to another or null
        if (currentSessionId === sessionIdToDelete) {
          const remainingSessions = sessions.filter(
            (s) => s.id !== sessionIdToDelete,
          );
          setCurrentSessionId(remainingSessions[0]?.id || null);
        }
      } catch (e) {
        console.error('Error deleting chat session from Supabase:', e);
        setError(e);
      } finally {
        setIsLoading(false);
      }
    }
  };

  if (isLoading && !sessions.length && !error) {
    return (
      <div className="p-6 text-center text-light-gray">Loading sessions...</div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center text-red-400">
        Error loading sessions: {error.message}
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-dark-gray rounded-r-xl border-r border-mid-gray shadow-2xl p-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-off-white">Chat Sessions</h2>
        <button
          onClick={toggleSidebar}
          className="lg:hidden text-light-gray hover:text-white transition-colors p-2 rounded-full hover:bg-mid-gray"
          aria-label="Close sidebar"
        >
          <FaXmark />
        </button>
      </div>

      <motion.button
        onClick={handleNewChat}
        className="btn-action flex items-center justify-center w-full py-3 mb-6
                   rounded-lg shadow-lg hover:shadow-xl transition-all duration-300
                   bg-teal-600 text-white hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-opacity-50"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <FaPlus className="mr-2" /> New Chat Session
      </motion.button>

      <div className="flex-grow overflow-y-auto custom-scrollbar pr-2">
        {sessions.length > 0 ? (
          <ul className="space-y-3">
            {sessions.map((session) => (
              <motion.li
                key={session.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                className={`flex items-center justify-between p-3 rounded-lg cursor-pointer
                            ${
                              currentSessionId === session.id
                                ? 'bg-teal-700/60 text-white border border-teal-500/60 shadow-lg'
                                : 'bg-dark-gray/30 text-light-gray hover:bg-dark-gray/50 border border-transparent hover:border-mid-gray/50'
                            }
                            transition-all duration-200 backdrop-blur-sm`}
                onClick={() => selectSession(session.id)}
              >
                <div className="flex items-center overflow-hidden">
                  <FaRegMessage className="mr-3 text-lg flex-shrink-0" />
                  {/* Display session name, ensure it doesn't break layout if too long */}
                  <span className="font-medium truncate flex-grow">
                    {session.name}
                  </span>
                  {session.is_temporary && (
                    <span className="ml-2 text-xs bg-yellow-600/30 text-yellow-300 px-2 py-1 rounded-full flex-shrink-0">
                      Temp
                    </span>
                  )}
                </div>
                <motion.button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteSession(session.id);
                  }}
                  className="p-2 text-white/40 hover:text-red-400 rounded-full hover:bg-dark-gray/60 transition-colors flex-shrink-0"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  aria-label={`Delete chat session ${session.name}`}
                >
                  <FaTrash className="w-4 h-4" />
                </motion.button>
              </motion.li>
            ))}
          </ul>
        ) : (
          <p className="text-white/60 text-sm text-center py-4">
            No chat sessions yet. Click &quot;New Chat Session&quot; to begin!
          </p>
        )}
      </div>
    </div>
  );
};

ChatSidebar.propTypes = {
  userId: PropTypes.string,
  // Removed supabase from propTypes as it's directly imported
  currentSessionId: PropTypes.string,
  setCurrentSessionId: PropTypes.func.isRequired,
  toggleSidebar: PropTypes.func.isRequired,
  ollamaModels: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      status: PropTypes.string.isRequired,
    }),
  ).isRequired,
};

export default ChatSidebar;
