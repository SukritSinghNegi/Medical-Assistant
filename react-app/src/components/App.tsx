import React, { useState ,  useEffect } from 'react';
import ToggleButton from './Chatbot/ToggleButton';
import Chatbot from './Chatbot/Chatbot';
import SidebarMenu from './Pages/SidebarMenu';
import './App.css';
import { v4 as uuidv4 } from 'uuid';

const App: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    // Check if a userId already exists in localStorage
    let storedUserId = localStorage.getItem('userId');
    
    // If no userId exists, generate a new one and store it
    if (!storedUserId) {
      storedUserId = uuidv4();
      localStorage.setItem('userId', storedUserId);
    }
    
    setUserId(storedUserId);
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
