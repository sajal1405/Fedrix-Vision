import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion } from "framer-motion";
import PropTypes from "prop-types";

const EventModal = ({ slot, event, onClose, onSave }) => {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [project, setProject] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [tag, setTag] = useState("");
  const [tagColor, setTagColor] = useState("#6f0c8a");
  const [type, setType] = useState("meeting");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");

  useEffect(() => {
    if (event) {
      setTitle(event.title || "");
      setDesc(event.description || "");
      setStart(event.start?.toISOString().slice(0, 16));
      setEnd(event.end?.toISOString().slice(0, 16));
      setProject(event.project || "");
      setPriority(event.priority || "Medium");
      setTag(event.tag || "");
      setTagColor(event.tag_color || "#6f0c8a");
      setType(event.type || "meeting");
    } else if (slot?.start) {
      const startTime = new Date(slot.start).toISOString().slice(0, 16);
      const endTime = new Date(slot.end || slot.start).toISOString().slice(0, 16);
      setStart(startTime);
      setEnd(endTime);
      setType("meeting");
    }
  }, [event, slot]);

  const handleSubmit = (e) => {
    e.preventDefault();

    onSave({
      title,
      description: desc,
      start: new Date(start),
      end: new Date(end),
      project,
      tag,
      tag_color: tagColor,
      priority,
      type,
    });
  };

  return createPortal(
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-black border border-white/10 p-6 rounded-2xl max-w-lg w-full text-white backdrop-blur-md"
      >
        <h3 className="text-xl font-semibold mb-4">
          {event ? "✏️ Edit Event" : "➕ Add New Event"}
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            required
            placeholder="Event title"
            className="w-full p-3 rounded-md bg-white/10 border border-white/20"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <textarea
            rows="3"
            placeholder="Description"
            className="w-full p-3 rounded-md bg-white/10 border border-white/20"
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
          ></textarea>

          <div className="grid grid-cols-2 gap-4">
            <input
              type="datetime-local"
              value={start}
              onChange={(e) => setStart(e.target.value)}
              className="p-3 bg-white/10 border border-white/20 rounded-md"
              required
            />
            <input
              type="datetime-local"
              value={end}
              onChange={(e) => setEnd(e.target.value)}
              className="p-3 bg-white/10 border border-white/20 rounded-md"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Project name"
              value={project}
              onChange={(e) => setProject(e.target.value)}
              className="p-3 bg-white/10 border border-white/20 rounded-md"
            />

            <select
              aria-label="Event Type"
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="p-3 bg-white/10 border border-white/20 rounded-md"
            >
              <option value="meeting">Meeting</option>
              <option value="appointment">Appointment</option>
              <option value="reminder">Reminder</option>
            </select>

            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="p-3 bg-white/10 border border-white/20 rounded-md"
            >
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Tag"
              value={tag}
              onChange={(e) => setTag(e.target.value)}
              className="p-3 bg-white/10 border border-white/20 rounded-md"
            />
            <input
              type="color"
              value={tagColor}
              onChange={(e) => setTagColor(e.target.value)}
              className="w-full h-12 p-0 bg-transparent border border-white/20 rounded-md"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-sm rounded-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-fedrix hover:bg-purple-700 text-white rounded-md font-medium"
            >
              Save Event
            </button>
          </div>
        </form>
      </motion.div>
    </div>,
    document.body
  );
};

EventModal.propTypes = {
  slot: PropTypes.shape({
    start: PropTypes.instanceOf(Date),
    end: PropTypes.instanceOf(Date),
  }),
  event: PropTypes.shape({
    id: PropTypes.number,
    title: PropTypes.string,
    description: PropTypes.string,
    start: PropTypes.instanceOf(Date),
    end: PropTypes.instanceOf(Date),
    project: PropTypes.string,
    priority: PropTypes.string,
    tag: PropTypes.string,
    tag_color: PropTypes.string,
    type: PropTypes.string,
  }),
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
};

export default EventModal;
