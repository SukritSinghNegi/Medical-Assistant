import React, { useState, useEffect, useRef } from 'react';
import './Chatbot.css';
import MessageCard from './MessageCard';
import Cookies from 'js-cookie';

interface Message {
  sender: 'user' | 'bot';
  text: string;
}

const handleSpeak = (speech: string) => {
  const msg = new SpeechSynthesisUtterance();
  msg.text = speech;
  msg.rate = 0.75;
  msg.pitch = 2;
  window.speechSynthesis.speak(msg);
};

const getDefaultGreetingMessage = (chatbotName: string): Message => ({
  sender: 'bot',
  text: `Hello! How can ${chatbotName} assist you today?`
});

const getErrorMessage = (): Message => ({
  sender: 'bot',
  text: "I am currently facing some issues. I'll be back soon."
});

const Chatbot: React.FC<{ isOpen: boolean; onToggle: () => void; chatbotName: string }> = ({ isOpen, onToggle, chatbotName }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false); 
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const [activestate, setActivestate] = useState(true);

  useEffect(() => {
    if (messages.length === 0){
      const greetingMessage = getDefaultGreetingMessage(chatbotName);
      setMessages([greetingMessage]);
      handleSpeak(greetingMessage.text);
      setActivestate(true);
    }
  }, [chatbotName]);

  const handleSend = async () => {
    if (input.trim()) {
      const userMessage: Message = { sender: 'user', text: input };
      setMessages((prevMessages) => [...prevMessages, userMessage]);
      setInput('');
      setLoading(true);

      try {
        const userId = Cookies.get('sessionid');
        console.log(userId, activestate, input);
        
        // Send user message with active state = true
        const userResponse = await fetch(`http://127.0.0.1:8000/${chatbotName}/user/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ text: input, user_id: userId, active: true }), // Set active to true when sending a message
        });

        if (userResponse.ok) {
          const botResponse = await fetch(`http://127.0.0.1:8000/${chatbotName}/bot/?user_id=${userId}`);
          if (botResponse.ok) {
            const data = await botResponse.json();
            setActivestate(data.active);
            const botMessage: Message = { sender: 'bot', text: data.response };
            setMessages((prevMessages) => [...prevMessages, botMessage]);
            handleSpeak(data.response);
          } else {
            console.error('Error fetching bot response:', botResponse.statusText);
          }
        } else {
          console.error('Error sending user message:', userResponse.statusText);
        }
      } catch (error) {
        console.error('Error handling message:', error);
        setMessages((prevMessages) => [
          ...prevMessages,
          getErrorMessage(),
        ]);
        handleSpeak(getErrorMessage().text);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleSend();
    }
  };

  const handleClear = async () => {
    const userId = Cookies.get('sessionid');
    console.log("Clearing session for user:", userId);

    // Clear session by setting active state to false
    await fetch(`http://127.0.0.1:8000/${chatbotName}/user/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text: '', user_id: userId, active: false }), // Set active to false to clear the session
    });

    const greetingMessage = getDefaultGreetingMessage(chatbotName);
    setMessages([greetingMessage]);
    handleSpeak(greetingMessage.text);
    setActivestate(false);
  };

  useEffect(() => {
    handleClear();
  }, [chatbotName]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  return (
    <div className={`chatbot-container ${isOpen ? '' : 'collapsed'}`}>
      <div className="chatbot-header">
        <div>{chatbotName}</div>
        <button className="clear-button" onClick={handleClear}>&#10227;</button>
      </div>
      <div className="chatbot-messages">
        {messages.map((msg, index) => (
          <MessageCard key={index} sender={msg.sender} text={msg.text} />
        ))}
        {loading && (
          <div className="loading-dots" />
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className="chatbot-input">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your message..."
        />
        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  );
};

export default Chatbot;
