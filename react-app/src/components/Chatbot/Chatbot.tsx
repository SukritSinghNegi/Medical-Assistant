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
  msg.rate = 0.75; // Speed of the speech (0.1 to 10)
  msg.pitch = 2; // Pitch of the voice (0 to 2)
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
    // Show default greeting message if messages are empty
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
        // Send user message to the /chatbot/user endpoint
        const userId = Cookies.get('sessionid');
        console.log(userId , activestate,input);
        const userResponse = await fetch(`http://127.0.0.1:8000/${chatbotName}/user/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ text: input , user_id: userId, active: activestate }),

        });
  
        if (userResponse.ok) {
          // Fetch bot's response from the /chatbot/bot endpoint
          const botResponse = await fetch(`http://127.0.0.1:8000/${chatbotName}/bot/?user_id=${userId}`);
          if (botResponse.ok) {
            const data = await botResponse.json();
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
        // Add fallback message
        setMessages((prevMessages) => [
          ...prevMessages,
          getErrorMessage(),
        ]);
        handleSpeak(getErrorMessage().text)
      } finally {
        setLoading(false); 
      }
    }
  };
  

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleSend();
      setActivestate(true);
    }
  };

  const handleClear = () => {
    const greetingMessage = getDefaultGreetingMessage(chatbotName);
    setMessages([greetingMessage]);
    handleSpeak(greetingMessage.text);
    setMessages([getDefaultGreetingMessage(chatbotName)]);
    setActivestate(false);
  };

  useEffect(() => {
    // Clear messages when chatbotName changes
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
          <div className="loading-dots"/>
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
