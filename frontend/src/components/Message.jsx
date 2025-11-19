import React from "react";

const Message = ({ message }) => {
  if (!message.text) return null;

  const bg = message.type === 'success' ? '#D1FAE5' : '#FEE2E2';
  const color = message.type === 'success' ? '#065F46' : '#B91C1C';
  const border = message.type === 'success' ? '#10B981' : '#F87171';

  return (
    <div style={{ marginBottom: '1rem', padding: '1rem', borderRadius: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', background: bg, color, border: `2px solid ${border}` }}>
      <span>{message.text}</span>
    </div>
  );
};

export default Message;
