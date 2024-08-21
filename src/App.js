import React, { useState, useEffect } from 'react';
import { Ollama } from 'ollama/browser';
import './App.css';

const ollama = new Ollama({ host: 'http://127.0.0.1:11434' });

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Add this useEffect hook
  useEffect(() => {
    console.log('Conversation history:', JSON.stringify(messages, null, 2));
  }, [messages]);

  const sendMessage = async () => {
    if (input.trim() === '') return;

    setIsLoading(true);
    const userMessage = { role: 'user', content: input };
    setMessages(prevMessages => [...prevMessages, userMessage]);
    setInput('');

    try {
      const response = await ollama.chat({
        model: 'llama3.1',
        messages: [...messages, userMessage],
      });

      const assistantMessage = { role: 'assistant', content: response.message.content };
      setMessages(prevMessages => [...prevMessages, assistantMessage]);
    } catch (error) {
      console.error('Error:', error);
      setMessages(prevMessages => [...prevMessages, { role: 'error', content: `An error occurred: ${error.message}` }]);
    }

    setIsLoading(false);
  };

  return (
    <div className="App">
      <h1>Ollama Chat</h1>
      <div className="chat-container">
        {messages.map((message, index) => (
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
