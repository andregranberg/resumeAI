import React, { useState, useEffect } from 'react';
import { Ollama } from 'ollama/browser';
import './App.css';

const ollama = new Ollama({ host: 'http://127.0.0.1:11434' });

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [systemPrompt, setSystemPrompt] = useState("You are a bot who does as told.");

  useEffect(() => {
    console.log('Conversation history:', JSON.stringify(messages, null, 2));
  }, [messages]);

  useEffect(() => {
    console.log('System prompt:', systemPrompt);
  }, [systemPrompt]);

  const sendMessage = async () => {
    if (input.trim() === '') return;

    setIsLoading(true);
    const userMessage = { role: 'user', content: input };
    setInput('');

    const updatedMessages = [
      { role: 'system', content: systemPrompt },
      ...messages,
      userMessage
    ];

    try {
      const response = await ollama.chat({
        model: 'llama3.1',
        messages: updatedMessages,
      });

      const assistantMessage = { role: 'assistant', content: response.message.content };
      setMessages([...updatedMessages, assistantMessage]);
    } catch (error) {
      console.error('Error:', error);
      setMessages([...updatedMessages, { role: 'error', content: `An error occurred: ${error.message}` }]);
    }

    setIsLoading(false);
  };

  return (
    <div className="App">
      <h1>Ollama Chat</h1>
      <div className="system-prompt-container">
        <input
          type="text"
          value={systemPrompt}
          onChange={(e) => setSystemPrompt(e.target.value)}
          placeholder="Enter system prompt..."
        />
      </div>
      <div className="chat-container">
        {messages.filter(m => m.role !== 'system').map((message, index) => (
          <div key={index} className={`message ${message.role}`}>
            <strong>{message.role === 'user' ? 'You' : message.role === 'assistant' ? 'AI' : 'Error'}:</strong> {message.content}
          </div>
        ))}
      </div>
      <div className="input-container">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          placeholder="Type your message..."
          disabled={isLoading}
        />
        <button onClick={sendMessage} disabled={isLoading}>
          {isLoading ? 'Sending...' : 'Send'}
        </button>
      </div>
    </div>
  );
}

export default App;