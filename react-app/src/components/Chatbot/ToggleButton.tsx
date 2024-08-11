import React from 'react';
import './ToggleButton.css';


interface ToggleButtonProps {
  isOpen: boolean;
  onClick: () => void;
}

const ToggleButton: React.FC<ToggleButtonProps> = ({ isOpen, onClick }) => {
  return (
    <div
      className={`toggle-button ${isOpen ? 'open' : ''}`}
      onClick={onClick}
    >
      {isOpen ? (
        <span className="toggle-icon">{'\u002B'}</span>
      ) : (
        <img src="\logo.png" alt="Menu Icon" className="toggle-image" />
      )}
    </div>
  );
};

export default ToggleButton;
