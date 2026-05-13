import React from 'react';

const GlassCard = ({ children, className = '', delay = 0, style = {} }) => {
  return (
    <div
      className={`glass-card ${className}`}
      style={{ 
        ...style,
        animation: `fadeIn 0.5s ease-out ${delay}s both`
      }}
    >
      {children}
    </div>
  );
};

export default GlassCard;
