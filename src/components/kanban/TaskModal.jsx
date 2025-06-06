import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { createPortal } from "react-dom";
import { supabase } from "../../supabaseClient";
import { motion } from "framer-motion";

const TaskModal = ({ isOpen, onClose, onSaved, taskToEdit }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [project, setProject] = useState("");
  const [status, setStatus] = useState("To Do");
  const [priority, setPriority] = useState("Medium");
  const [customTag, setCustomTag] = useState("");
  const [customColor, setCustomColor] = useState("#6f0c8a");

  useEffect(() => {
    if (taskToEdit) {
      setTitle(taskToEdit.title);
      setDescription(taskToEdit.description);
      setProject(taskToEdit.project);
      setStatus(taskToEdit.status);
      setPriority(taskToEdit.priority || "Medium");
      setCustomTag(taskToEdit.custom_tag || "");
      setCustomColor(taskToEdit.custom_color || "#6f0c8a");
    } else {
      setTitle("");
      setDescription("");
      setProject("");
      setStatus("To Do");
      setPriority("Medium");
      setCustomTag("");
      setCustomColor("#6f0c8a");
    }
  }, [taskToEdit]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const {
      data: { user: supaUser },
    } = await supabase.auth.getUser();

    const taskData = {
      title,
      description,
      project,
      status,
      priority,
      custom_tag: customTag,
      custom_color: customColor,
      email: supaUser.email,
      created_by: supaUser.id,
    };

    if (taskToEdit?.id) {
      await supabase.from("tasks").update(taskData).eq("id", taskToEdit.id);
    } else {
      await supabase.from("tasks").insert(taskData);
    }

    onSaved();
    onClose();
  };

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center px-4">
      <motion.div
        className="w-full max-w-lg bg-black border border-white/10 rounded-xl shadow-2xl p-6"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -30 }}
      >
        <h3 className="text-xl text-white font-bold mb-4">
          {taskToEdit ? "✏️ Edit Task" : "➕ New Task"}
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            required
            placeholder="Task title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-3 rounded-lg bg-white/5 text-white border border-white/20"
          />

          <textarea
            placeholder="Description"
            rows="3"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-3 rounded-lg bg-white/5 text-white border border-white/20"
          />

          <input
            type="text"
            placeholder="Project name"
            value={project}
            onChange={(e) => setProject(e.target.value)}
            className="w-full p-3 rounded-lg bg-white/5 text-white border border-white/20"
          />

          <div className="flex flex-col sm:flex-row gap-3">
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="flex-1 p-3 rounded-lg bg-white/5 text-white border border-white/20"
            >
              <option>To Do</option>
              <option>In Progress</option>
              <option>Done</option>
            </select>

            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="flex-1 p-3 rounded-lg bg-white/5 text-white border border-white/20"
            >
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
            </select>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 items-center">
            <input
              type="text"
              placeholder="Custom tag (optional)"
              value={customTag}
              onChange={(e) => setCustomTag(e.target.value)}
              className="flex-1 p-3 rounded-lg bg-white/5 text-white border border-white/20"
            />
            <input
              type="color"
              value={customColor}
              onChange={(e) => setCustomColor(e.target.value)}
              className="w-12 h-12 rounded-full border border-white/20"
              title="Choose tag color"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="bg-white/10 text-white px-4 py-2 rounded-md hover:bg-white/20"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-fedrix text-white px-6 py-2 rounded-md hover:bg-purple-800 transition"
            >
              {taskToEdit ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </motion.div>
    </div>,
    document.body
  );
};

TaskModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSaved: PropTypes.func.isRequired,
  taskToEdit: PropTypes.shape({
    id: PropTypes.number,
    title: PropTypes.string,
    description: PropTypes.string,
    project: PropTypes.string,
    status: PropTypes.string,
    priority: PropTypes.string,
    custom_tag: PropTypes.string,
    custom_color: PropTypes.string,
  }),
};

export default TaskModal;
