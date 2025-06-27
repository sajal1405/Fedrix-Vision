import React from 'react';

const KanbanCard = ({ card, sourceCol }) => {
  const handleDragStart = (e) => {
    e.dataTransfer.setData('text/plain', JSON.stringify({ card, sourceCol }));
  };

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      style={{
        background: '#111',
        padding: '1rem',
        borderRadius: '8px',
        marginBottom: '1rem',
        boxShadow: '0 0 10px rgba(255,255,255,0.05)',
        cursor: 'grab',
      }}
    >
      <span style={{ color: '#fff' }}>{card.title}</span>
    </div>
  );
};

export default KanbanCard;
