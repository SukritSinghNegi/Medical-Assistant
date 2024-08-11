import React, { useState } from 'react';
import ToggleButton from './Chatbot/ToggleButton';
import Chatbot from './Chatbot/Chatbot';
import SidebarMenu from './Pages/SidebarMenu';
import './App.css';

const App: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

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
