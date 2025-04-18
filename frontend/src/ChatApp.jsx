import React, { useState } from 'react';
import './ChatApp.css'; // import the new CSS

const ChatApp = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  const sendMessage = async () => {
    if (!input.trim()) return;

    const updatedMessages = [...messages, { sender: 'user', text: input }];
    setMessages(updatedMessages);
    setInput('');

    try {
      const response = await fetch('http://127.0.0.1:5000/completion', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ message: input })
      });
      const data = await response.json();
      const botReply = data.response || 'No response from bot.';
      setMessages([...updatedMessages, { sender: 'bot', text: botReply }]);
    } catch (error) {
      setMessages([...updatedMessages, { sender: 'bot', text: 'Error: Could not reach backend.' }]);
    }
  };

  return (
    <div className="chat-app-container">
      <h2>Gemini Chatbot</h2>
      <div className="chat-messages">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className="chat-message"
            style={{ textAlign: msg.sender === 'user' ? 'right' : 'left' }}
          >
            <strong>{msg.sender === 'user' ? 'You' : 'Bot'}:</strong> {msg.text}
          </div>
        ))}
      </div>
      <div className="input-container">
        <input
          className="input-field"
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
        />
        <button className="send-button" onClick={sendMessage}>
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatApp;