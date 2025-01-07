import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';

const ChatInterface = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = {
      role: 'user',
      content: input
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.post('/api/chat', {
        message: input
      });

      if (response.data.error) {
        throw new Error(response.data.error);
      }

      const aiMessage = {
        role: 'assistant',
        content: response.data.message
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error:', error);
      setError(error.message || 'Failed to get response from AI');
      setMessages(prev => [...prev, {
        role: 'system',
        content: 'Sorry, I encountered an error. Please try again.'
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-matrix-black text-terminal-green font-mono">
      <div className="terminal-header flex justify-between items-center px-4 py-2">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
        </div>
        <div className="text-neon-red font-bold animate-pulse">AXION TERMINAL v1.0</div>
        <div className="text-neon-red">[CONNECTED]</div>
      </div>

      {error && (
        <div className="bg-red-900/20 text-red-500 p-2 text-center terminal-text border-y border-red-500">
          [ERROR] {error}
        </div>
      )}

      <div className="flex-1 p-4 overflow-y-auto cyberpunk-scrollbar">
        <div className="space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${
                message.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`max-w-[80%] p-3 ${
                  message.role === 'user'
                    ? 'bg-cyber-black text-neon-red'
                    : message.role === 'system'
                    ? 'bg-red-900/30 text-red-500'
                    : 'bg-red-900/10 text-neon-red'
                } cyberpunk-border terminal-text`}
              >
                {message.role !== 'user' && <span className="text-xs text-red-500 block mb-1">[AXION]:</span>}
                {message.content}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="loading-dots">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-4 border-t border-neon-red bg-cyber-black">
        <div className="flex space-x-4">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 bg-matrix-black text-neon-red border-2 border-neon-red p-2 
                     focus:outline-none focus:border-red-700 terminal-text placeholder-red-800"
            placeholder="Enter command..."
            disabled={isLoading}
          />
          <button
            type="submit"
            className="px-6 py-2 bg-red-900/30 text-neon-red border-2 border-neon-red
                     hover:bg-red-900/50 transition-colors duration-300 
                     disabled:opacity-50 disabled:cursor-not-allowed terminal-text"
            disabled={isLoading || !input.trim()}
          >
            EXECUTE
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatInterface; 