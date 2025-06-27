// src/components/dashboard/AIChatWidget.jsx
import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';

const AIChatWidget = ({ className }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const element = messagesEndRef.current;
    if (element) {
      // Auto-scroll only if already at the bottom or very close, or if it's a new message
      const isScrolledToBottom =
        element.scrollHeight - element.clientHeight <= element.scrollTop + 50;
      if (
        isScrolledToBottom ||
        (messages.length > 0 && messages[messages.length - 1].role === 'model')
      ) {
        element.scrollTop = element.scrollHeight;
      }
    }
  }, [messages]);

  const sendMessageToAI = async (userMessage) => {
    setIsLoading(true);
    setMessages((prevMessages) => [
      ...prevMessages,
      { role: 'user', text: userMessage },
    ]);
    setInput('');

    try {
      const chatHistory = messages.map((msg) => ({
        role: msg.role,
        parts: [{ text: msg.text }],
      }));
      chatHistory.push({ role: 'user', parts: [{ text: userMessage }] });

      const payload = { contents: chatHistory };
      const apiKey = '';
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (
        result.candidates &&
        result.candidates.length > 0 &&
        result.candidates[0].content &&
        result.candidates[0].content.parts &&
        result.candidates[0].content.parts.length > 0
      ) {
        const aiResponse = result.candidates[0].content.parts[0].text;
        setMessages((prevMessages) => [
          ...prevMessages,
          { role: 'model', text: aiResponse },
        ]);
      } else {
        setMessages((prevMessages) => [
          ...prevMessages,
          { role: 'model', text: 'Sorry, I could not get a response.' },
        ]);
      }
    } catch (error) {
      console.error('Error sending message to AI:', error);
      setMessages((prevMessages) => [
        ...prevMessages,
        { role: 'model', text: `Error: ${error.message}` },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSend = (e) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      sendMessageToAI(input.trim());
    }
  };

  return (
    <div
      className={`glassy-tile rounded-xl shadow-2xl min-h-[300px] p-6 flex flex-col ${className || ''}
                    bg-gradient-to-br from-cyan-900/60 via-blue-900/30 to-cyan-800/50`}
    >
      <h3 className="text-lg font-semibold text-white/80 mb-4 pb-2 border-b border-indigo-600/30 flex items-center justify-between">
        Agent AI Chat
        <span className="text-xs font-normal text-green-400 bg-green-900/30 px-2 py-1 rounded-full border border-green-700/50">
          Live
        </span>
      </h3>

      <div
        ref={messagesEndRef}
        className="flex-grow overflow-y-auto custom-scrollbar pr-2 mb-4 space-y-3"
      >
        {messages.length === 0 && (
          <p className="text-white/60 text-sm text-center py-4">
            Ask me anything!
          </p>
        )}
        {messages.map((msg, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] p-3 rounded-lg text-sm shadow-md backdrop-blur-sm
                          ${
                            msg.role === 'user'
                              ? 'bg-teal-700/70 text-white self-end border border-teal-500/60'
                              : 'bg-dark-gray/70 text-white/90 self-start border border-mid-gray/60'
                          }`}
            >
              {msg.text}
            </div>
          </motion.div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              className="max-w-[80%] p-3 rounded-lg text-sm bg-dark-gray/70 text-white/90 flex items-center border border-mid-gray/60 backdrop-blur-sm"
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
              <span>Agent is typing...</span>
            </motion.div>
          </div>
        )}
      </div>

      <form onSubmit={handleSend} className="flex space-x-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          className="flex-grow p-3 rounded-lg bg-dark-gray border border-white/20 text-white/90
                     focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 shadow-inner"
          disabled={isLoading}
        />
        <motion.button
          type="submit"
          className="btn-primary py-3 px-6 rounded-lg bg-teal-600 hover:bg-teal-700 transition-colors duration-300
                     shadow-md hover:shadow-lg transform hover:scale-105"
          disabled={isLoading || !input.trim()}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Send
        </motion.button>
      </form>
    </div>
  );
};

AIChatWidget.propTypes = {
  className: PropTypes.string,
};

export default AIChatWidget;
