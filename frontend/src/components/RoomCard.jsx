import React from "react";

const RoomCard = ({ room, selected, onSelect }) => (
  <div 
    onClick={() => onSelect(room)}
    style={{
      padding: '1rem',
      border: selected ? '2px solid #3b82f6' : '2px solid #E5E7EB',
      borderRadius: '1rem',
      marginBottom: '1rem',
      cursor: 'pointer',
      background: selected ? '#EFF6FF' : '#FFFFFF',
      boxShadow: selected ? '0 4px 8px rgba(0,0,0,0.1)' : '0 1px 3px rgba(0,0,0,0.05)'
    }}
  >
    <h3>{room.name}</h3>
    <p>Capacity: {room.capacity}</p>
    <p>₹{room.baseHourlyRate}/hour</p>
  </div>
);

export default RoomCard;
