// src/components/kanban/KanbanColumn.js

import React from 'react';
import KanbanCard from './KanbanCard';

const columnLabels = {
  todo: '📝 To Do',
  inProgress: '🚧 In Progress',
  review: '🔎 Review',
  done: '✅ Completed',
};

const KanbanColumn = ({ title, cards, onDrop, sourceCol }) => {
  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const data = JSON.parse(e.dataTransfer.getData('text/plain'));
    onDrop(data.card, data.sourceCol);
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      style={{
        flex: '0 0 260px',
        minHeight: '400px',
        background: 'rgba(255,255,255,0.05)',
        borderRadius: '12px',
        padding: '1rem',
        border: '1px solid rgba(255,255,255,0.1)',
      }}
    >
      <h3 style={{ marginBottom: '1rem', fontWeight: 500 }}>
        {columnLabels[title]}
      </h3>
      {cards.map((card) => (
        <KanbanCard key={card.id} card={card} sourceCol={sourceCol} />
      ))}
    </div>
  );
};

export default KanbanColumn;
