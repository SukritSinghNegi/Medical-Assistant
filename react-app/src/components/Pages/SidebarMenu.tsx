// SidebarMenu.tsx
import React, { useState } from 'react';
import './SidebarMenu.css'; // Import the CSS file for styling

const SidebarMenu: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div>
      <button className="menu-toggle" onClick={toggleMenu}>
        {isOpen ? '\u2715' : '\u2630'}
      </button>
      <div className={`sidebar-menu ${isOpen ? 'open' : 'closed'}`}>
        <ul className='contact-info'>
          <li><a href="#contact">Contact</a></li>
        </ul>
      </div>
    </div>
  );
};

export default SidebarMenu;
