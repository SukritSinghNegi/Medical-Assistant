// SidebarMenu.tsx
import React, { useState} from 'react';
import './SidebarMenu.css'; // Import the CSS file for styling


interface SidebarMenuProps {
  onChatbotSelect: (chatbot: string) => void;
}

const SidebarMenu: React.FC<SidebarMenuProps> = ({ onChatbotSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // State for dropdown
  


  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleChatbotClick = (chatbot: string) => {
    onChatbotSelect(chatbot); // Notify App of the selection
    setIsDropdownOpen(false);
  };

  return (
    <div>
      <button className="menu-toggle" onClick={toggleMenu}>
        {isOpen ? '\u2715' : '\u2630'}
      </button>
      <div className={`sidebar-menu ${isOpen ? 'open' : 'closed'}`}>
        <ul className='main-menu'>
          <li>
            <button className="dropdown-toggle" onClick={toggleDropdown}>
              Chatbot Options
            </button>
          </li>
        </ul>
        <ul className={`dropdown-menu ${isDropdownOpen ? 'open' : 'closed'}`}>
          <li><a href="#Ecommerce-Chatbot/" onClick={() => handleChatbotClick('Ecommerce-Chatbot')}>Ecommerce-Chatbot</a></li>
          <li><a href="#Medical-Assistant/" onClick={() => handleChatbotClick('Medical-Assistant')}>Medical-Assistant</a></li>
          <li><a href="#Code-Analyser/" onClick={() => handleChatbotClick('Code-Analyser')}>Code-Analyser</a></li>
        </ul>
        <ul className='contact-info'>
          <li><a href="#contact">Contact</a></li>
        </ul>
      </div>
    </div>
  );
};

export default SidebarMenu;
