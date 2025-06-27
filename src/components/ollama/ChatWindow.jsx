// src/components/ollama/ChatWindow.jsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';

import ChatInput from './ChatInput';
import supabase from '../../utils/supabase';

const ChatWindow = ({
  userId,
  currentSessionId,
  // eslint-disable-next-line no-unused-vars
  setCurrentSessionId,
  ollamaModels,
}) => {
  const [messages, setMessages] = useState([]);
  const [isLoadingReply, setIsLoadingReply] = useState(false);
  const [activeModelId, setActiveModelId] = useState(
    ollamaModels[0]?.id || null,
  );
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'end',
      });
    }
  }, [messages]);

  useEffect(() => {
    if (ollamaModels.length > 0 && !activeModelId) {
      setActiveModelId(ollamaModels[0].id);
    } else if (
      activeModelId &&
      !ollamaModels.some((m) => m.id === activeModelId)
    ) {
      setActiveModelId(ollamaModels[0]?.id || null);
    }
  }, [ollamaModels, activeModelId]);

  useEffect(() => {
    setMessages([]);

    if (!supabase || !currentSessionId) {
      console.log(
        'Supabase or currentSessionId not ready, showing empty chat.',
      );
      return;
    }

    setIsLoadingReply(true);

    const channel = supabase
      .channel(`session_messages_${currentSessionId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'messages',
          filter: `session_id=eq.${currentSessionId}`,
        },
        (payload) => {
          console.log('Supabase message change detected:', payload);
          fetchMessages();
        },
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          console.log(
            `Subscribed to messages for session: ${currentSessionId}`,
          );
        } else if (status === 'CHANNEL_ERROR') {
          console.error(
            `Supabase channel error for session ${currentSessionId}:`,
            status,
          );
        } else if (status === 'TIMED_OUT') {
          console.warn(
            `Supabase channel timed out for session ${currentSessionId}.`,
          );
        }
      });

    const fetchMessages = async () => {
      try {
        const { data, error } = await supabase
          .from('messages')
          .select('*')
          .eq('session_id', currentSessionId)
          .order('created_at', { ascending: true });

        if (error) throw error;

        setMessages(data);
      } catch (err) {
        console.error('Error fetching messages from Supabase:', err);
      } finally {
        setIsLoadingReply(false);
      }
    };

    fetchMessages();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [currentSessionId]);

  const handleSendMessage = useCallback(
    async (text) => {
      if (!text.trim() || !activeModelId) {
        if (!activeModelId)
          console.warn('No active AI model selected or available.');
        return;
      }
      if (!supabase || !currentSessionId || !userId) {
        console.error(
          'Supabase client, currentSessionId, or userId not available to send message.',
        );
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now(),
            text: 'Error: Chat not initialized. Please select or create a session.',
            sender: 'error',
          },
        ]);
        return;
      }

      const newUserMessage = {
        id: `m-${Date.now()}-user`,
        text,
        sender: 'user',
        model: activeModelId,
      };
      setMessages((prev) => [...prev, newUserMessage]);
      setIsLoadingReply(true);

      try {
        const selectedOllamaModel = ollamaModels.find(
          (m) => m.id === activeModelId,
        );
        if (!selectedOllamaModel || selectedOllamaModel.status !== 'active') {
          throw new Error(
            `Selected AI (${selectedOllamaModel?.name || activeModelId}) is not active or available.`,
          );
        }

        const { error: insertUserError } = await supabase
          .from('messages')
          .insert({
            session_id: currentSessionId,
            sender: 'user',
            content: text,
            model_id: activeModelId,
            user_id: userId,
          });
        if (insertUserError) throw insertUserError;

        const response = await fetch('http://localhost:11434/api/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            model: activeModelId,
            prompt: text,
            stream: false,
          }),
        });

        if (!response.ok) {
          const errorBody = await response.text();
          throw new Error(
            `Ollama API error: ${response.status} - ${errorBody}`,
          );
        }

        const data = await response.json();
        const aiResponseText = data.response;

        const { error: insertAIError } = await supabase
          .from('messages')
          .insert({
            session_id: currentSessionId,
            sender: 'model',
            content: aiResponseText,
            model_id: activeModelId,
            user_id: userId,
          });
        if (insertAIError) throw insertAIError;

        await supabase
          .from('chat_sessions')
          .update({ last_updated: new Date().toISOString() })
          .eq('id', currentSessionId);
      } catch (error) {
        console.error('Error sending message or saving to Supabase:', error);
        const errorMessage = {
          id: `m-${Date.now()}-error`,
          text: `Error: ${error.message}. Please ensure Ollama server is running and model '${activeModelId}' is available.`,
          sender: 'ai',
          model: 'error',
        };
        setMessages((prev) => [...prev, errorMessage]);
      } finally {
        setIsLoadingReply(false);
      }
    },
    [activeModelId, currentSessionId, ollamaModels, userId],
  );

  return (
    <div
      className={`hologram-tile p-6 flex flex-col flex-grow
                    bg-gradient-to-br from-dark-gray/60 to-black-ops/60`}
    >
      <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/10">
        <h2 className="text-xl font-semibold text-white">
          Chat with{' '}
          <span className="text-teal-400">
            {ollamaModels.find((m) => m.id === activeModelId)?.name ||
              'Select AI'}
          </span>
        </h2>
        {currentSessionId && currentSessionId.startsWith('temp-') && (
          <span className="text-xs bg-yellow-600/30 text-yellow-300 px-3 py-1 rounded-full border border-yellow-700/50">
            Temporary Session
          </span>
        )}
      </div>

      <div className="flex-grow overflow-y-auto custom-scrollbar p-3 space-y-4 rounded-lg bg-dark-gray/20 border border-mid-gray/30">
        {isLoadingReply && messages.length === 0 ? (
          <p className="text-white/60 text-center py-10">Loading messages...</p>
        ) : messages.length === 0 ? (
          <p className="text-white/60 text-center py-10">
            Start a conversation!
          </p>
        ) : (
          messages.map((msg, index) => (
            <motion.div
              key={msg.id || index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[75%] p-3 rounded-lg text-sm shadow-md backdrop-blur-sm
                            ${
                              msg.sender === 'user'
                                ? 'bg-teal-700/70 text-white self-end border border-teal-500/60'
                                : msg.sender === 'error'
                                  ? 'bg-red-700/70 text-white self-start border border-red-500/60'
                                  : 'bg-dark-gray/70 text-white/90 self-start border border-mid-gray/60'
                            }`}
              >
                {msg.text}
              </div>
            </motion.div>
          ))
        )}
        {isLoadingReply && messages.length > 0 && (
          <div className="flex justify-start">
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
              className="max-w-[75%] p-3 rounded-lg text-sm bg-dark-gray/70 text-white/90 flex items-center border border-mid-gray/60 backdrop-blur-sm"
            >
              <motion.svg
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                className="h-4 w-4 mr-2 text-white"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </motion.svg>
              <span>
                {ollamaModels.find((m) => m.id === activeModelId)?.name || 'AI'}{' '}
                is typing...
              </span>
            </motion.div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <ChatInput
        onSendMessage={handleSendMessage}
        isLoading={isLoadingReply}
        ollamaModels={ollamaModels}
        activeModelId={activeModelId}
        setActiveModelId={setActiveModelId}
      />
    </div>
  );
};

ChatWindow.propTypes = {
  userId: PropTypes.string,
  currentSessionId: PropTypes.string,
  setCurrentSessionId: PropTypes.func.isRequired,
  ollamaModels: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      status: PropTypes.string.isRequired,
    }),
  ).isRequired,
};

export default ChatWindow;
