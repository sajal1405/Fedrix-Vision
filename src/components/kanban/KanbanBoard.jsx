import React, { useContext, useEffect, useState, useCallback } from "react";
import PropTypes from "prop-types";
import { supabase } from "../../supabaseClient";
import { UserProfileContext } from "../../context/UserProfileContext";
import { motion } from "framer-motion";
import TaskCard from "./TaskCard.jsx";
import TaskModal from "./TaskModal.jsx";
import { DndProvider, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

const columns = ["To Do", "In Progress", "Done"];

const KanbanBoard = () => {
  const { profile } = useContext(UserProfileContext);
  const [tasks, setTasks] = useState([]);
  const [project, setProject] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  const fetchTasks = useCallback(async () => {
    const { data, error } = await supabase
      .from("tasks")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) console.error("Fetch Error", error);

    const visibleTasks =
      profile?.tier === "admin"
        ? data
        : data.filter((t) => t.created_by === profile?.id);

    setTasks(visibleTasks);
  }, [profile?.id, profile?.tier]);

  // Initial + Real-time Sync
  useEffect(() => {
    if (!profile?.id) return;
    fetchTasks();

    let taskChannel;
    try {
      taskChannel = supabase
        .channel("realtime-tasks")
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: "tasks" },
          () => fetchTasks()
        )
        .subscribe();
    } catch (err) {
      console.log(
        "Real-time updates disabled: could not subscribe to tasks channel."
      );
    }

    return () => {
      if (taskChannel) {
        supabase.removeChannel(taskChannel);
      }
    };
  }, [profile?.id, fetchTasks]);

  const grouped = columns.map((col) => ({
    name: col,
    items: tasks.filter(
      (t) => t.status === col && (!project || t.project === project)
    ),
  }));

  const projects = [...new Set(tasks.map((t) => t.project))];

  const onEdit = (task) => {
    setEditingTask(task);
    setShowModal(true);
  };

  const onDelete = async (id) => {
    await supabase.from("tasks").delete().eq("id", id);
    fetchTasks();
  };

  const onTaskSaved = () => {
    fetchTasks();
  };

  const onDrop = async (task, newStatus) => {
    if (task.status === newStatus) return;
    await supabase.from("tasks").update({ status: newStatus }).eq("id", task.id);
    fetchTasks();
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="mb-4 flex gap-3 items-center">
        <label className="text-white text-sm">📁 Filter by Project:</label>
        <select
          className="bg-black text-white border border-white/20 px-3 py-2 rounded-md"
          onChange={(e) => setProject(e.target.value)}
          value={project}
        >
          <option value="">All</option>
          {projects.map((p, i) => (
            <option key={i} value={p}>
              {p}
            </option>
          ))}
        </select>

        <button
          onClick={() => {
            setEditingTask(null);
            setShowModal(true);
          }}
          className="ml-auto bg-fedrix text-white px-4 py-2 rounded-md text-sm"
        >
          + New Task
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {grouped.map((column) => (
          <KanbanColumn
            key={column.name}
            name={column.name}
            items={column.items}
            onDrop={onDrop}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>

      {showModal && (
        <TaskModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          onSaved={onTaskSaved}
          taskToEdit={editingTask}
        />
      )}
    </DndProvider>
  );
};

export default KanbanBoard;

// 🧩 Column Wrapper
const KanbanColumn = ({ name, items, onDrop, onEdit, onDelete }) => {
  const [{ isOver }, dropRef] = useDrop({
    accept: "TASK_CARD",
    drop: (item) => onDrop(item.task, name),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  return (
    <motion.div
      ref={dropRef}
      className={`bg-white/5 border border-white/10 rounded-xl p-4 min-h-[300px] ${
        isOver ? "bg-fedrix/10" : ""
      }`}
      whileHover={{ scale: 1.01 }}
    >
      <h4 className="text-white font-bold mb-4">{name}</h4>
      {items.map((task) => (
        <TaskCard
          key={task.id}
          task={task}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </motion.div>
  );
};

KanbanColumn.propTypes = {
  name: PropTypes.string.isRequired,
  items: PropTypes.array.isRequired,
  onDrop: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};
