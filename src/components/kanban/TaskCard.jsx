// src/components/kanban/TaskCard.jsx
import React from "react";
import PropTypes from "prop-types";
import { useDrag } from "react-dnd";

const TaskCard = ({ task, onEdit, onDelete }) => {
  const [{ isDragging }, dragRef] = useDrag({
    type: "TASK_CARD",
    item: { task },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  return (
    <div
      ref={dragRef}
      className={`p-3 rounded-lg border mb-2 bg-black/40 text-white border-white/10 transition-all ${
        isDragging ? "opacity-50 scale-95" : ""
      }`}
    >
      <div className="flex justify-between items-center mb-1">
        <strong>{task.title}</strong>
        <div className="flex gap-2">
          <button onClick={() => onEdit(task)} className="text-xs text-yellow-400">
            ✏️
          </button>
          <button onClick={() => onDelete(task.id)} className="text-xs text-red-400">
            ❌
          </button>
        </div>
      </div>
      <p className="text-sm text-white/60 mb-2">{task.description}</p>
      <div className="flex flex-wrap gap-2">
        {task.priority && (
          <span className="px-2 py-1 rounded text-xs bg-yellow-500/10 border border-yellow-500 text-yellow-300">
            {task.priority}
          </span>
        )}
        {task.custom_tag && task.custom_color && (
          <span
            className="px-2 py-1 rounded text-xs"
            style={{
              backgroundColor: `${task.custom_color}20`,
              border: `1px solid ${task.custom_color}`,
              color: task.custom_color,
            }}
          >
            {task.custom_tag}
          </span>
        )}
      </div>
    </div>
  );
};

TaskCard.propTypes = {
  task: PropTypes.shape({
    id: PropTypes.number,
    title: PropTypes.string,
    description: PropTypes.string,
    priority: PropTypes.string,
    custom_tag: PropTypes.string,
    custom_color: PropTypes.string,
  }).isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default TaskCard;
