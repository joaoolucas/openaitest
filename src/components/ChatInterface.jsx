'use client';

import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';

const ChatInterface = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [bootSequence, setBootSequence] = useState(true);
  const [time, setTime] = useState(new Date().toLocaleTimeString());
  const messagesEndRef = useRef(null);

  // Update clock
  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Boot sequence
  useEffect(() => {
    let mounted = true;
    
    const runBootSequence = async () => {
      const bootMessages = [
        { content: "Initializing AXION OS v1.0...", delay: 500 },
        { content: "Loading core systems...", delay: 800 },
        { content: "Establishing neural networks...", delay: 1000 },
        { content: "Connecting to quantum mainframe...", delay: 1200 },
        { content: "SYSTEM READY", delay: 1000 }
      ];

      for (const msg of bootMessages) {
        if (!mounted) break;
        await new Promise(resolve => setTimeout(resolve, msg.delay));
        if (mounted) {
          setMessages(prev => [...prev, { role: 'system', content: msg.content }]);
        }
      }
      if (mounted) {
        setBootSequence(false);
      }
    };

    if (bootSequence) {
      runBootSequence();
    }

    return () => {
      mounted = false;
    };
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = {
      role: 'user',
      content: input.trim()
    };

    setInput('');
    setIsLoading(true);
    setError(null);
    setMessages(prev => [...prev, userMessage]);

    try {
      const response = await axios.post('/api/chat', {
        message: userMessage.content
      });

      if (response.data.error) {
        throw new Error(response.data.error);
      }

      setMessages(prev => [...prev, {
        role: 'assistant',
        content: response.data.message
      }]);
    } catch (error) {
      console.error('Error:', error);
      setError(error.message || 'Failed to get response from AI');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-black text-neon-red font-mono relative overflow-hidden">
      <div className="matrix-rain absolute inset-0 opacity-10 pointer-events-none"></div>
      
      <div className="terminal-header z-10">
        <div className="flex justify-between items-center border-b border-neon-red px-4 py-2">
          <div className="flex items-center gap-4">
            <span className="text-xl font-bold glitch-text">AXION OS</span>
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500 animate-pulse delay-75"></div>
              <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse delay-150"></div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="terminal-status">STATUS: ONLINE</span>
            <span className="terminal-time">{time}</span>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-900/20 border-y border-red-500 p-2">
          <div className="container mx-auto">
            <span className="text-red-500 font-bold">[ERROR]</span> {error}
          </div>
        </div>
      )}

      <div className="flex-1 overflow-y-auto cyberpunk-scrollbar p-4 z-10">
        <div className="space-y-2">
          {messages.map((message, index) => (
            <div
              key={`msg-${index}-${message.role}`}
              className={`terminal-line ${
                message.role === 'user' ? 'user-message' : 'system-message'
              }`}
            >
              {message.role === 'user' ? (
                <span className="text-green-500">guest@axion:~$</span>
              ) : (
                <span className="text-red-500">[AXION]</span>
              )}
              <span className="ml-2">{message.content}</span>
            </div>
          ))}
          {isLoading && (
            <div className="terminal-line system-message">
              <span className="text-red-500">[AXION]</span>
              <span className="ml-2 loading-cursor">Processing request...</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="terminal-input z-10 p-4 border-t border-neon-red">
        <form onSubmit={handleSubmit} className="flex items-center gap-2">
          <span className="text-green-500">guest@axion:~$</span>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 bg-transparent text-neon-red caret-neon-red focus:outline-none"
            placeholder="Enter command..."
            disabled={isLoading || bootSequence}
            autoComplete="off"
          />
        </form>
      </div>
    </div>
  );
};

export default ChatInterface; 