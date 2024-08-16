import React, { useState ,  useEffect } from 'react';
import ToggleButton from './Chatbot/ToggleButton';
import Chatbot from './Chatbot/Chatbot';
import SidebarMenu from './Pages/SidebarMenu';
import './App.css';
import { v4 as uuidv4 } from 'uuid'; // Import uuid
import { setSessionIdCookie, getSessionIdCookie } from '../utils/cookies';

const App: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const existingSessionId = getSessionIdCookie();
    if (!existingSessionId) {
      // Generate a new session ID (e.g., a random UUID)
      const newSessionId = uuidv4(); // Replace with your own session ID generation logic
      setSessionIdCookie(newSessionId);
    }
  }, []);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="App">
      <header className="App-header">
        <SidebarMenu />
        <nav className="App-nav">
          <ul>
            <li><a href="#about">About</a></li>
            <li><a href="#projects">Projects</a></li>
            <li><a href="#blog">Blog</a></li>
          </ul>
        </nav>
        
      </header>
      <Chatbot isOpen={isOpen} onToggle={handleToggle} />
      <ToggleButton isOpen={isOpen} onClick={handleToggle} />
    </div>
  );
};

export default App;
