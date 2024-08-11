import React from 'react';
import './MessageCard.css';

interface MessageProps {
  sender: 'user' | 'bot';
  text: string;
}

const MessageCard: React.FC<MessageProps> = ({ sender, text }) => {
  return (
    <div className={`message ${sender}`}>
      <span>{text}</span>
    </div>
  );
};

export default MessageCard;
