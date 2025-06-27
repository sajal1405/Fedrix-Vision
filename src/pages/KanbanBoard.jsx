// src/pages/KanbanBoard.jsx
import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
  useRef,
} from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { motion, AnimatePresence } from 'framer-motion';
import TaskModal from '../components/kanban/TaskModal';
import supabase from '../utils/supabase';
import { useUserProfile } from '../context/UserProfileContext';
import { useClientContext } from '../context/ClientContext';

const COLUMN_DEFS = [
  { id: 'todo', label: 'To Do' },
  { id: 'inprogress', label: 'In Progress' },
  { id: 'done', label: 'Done' },
];

const KanbanBoard = () => {
  const { userProfile } = useUserProfile();
  const { selectedClient } = useClientContext();
  const [tasks, setTasks] = useState([]);
  const [subtasks, setSubtasks] = useState([]);
  const [filters, setFilters] = useState({
    project: '',
    tag: '',
    assigned_to: '',
  });
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const channelRef = useRef(null);

  // -- Fetch all users for assignment/filter
  const [users, setUsers] = useState([]);
  useEffect(() => {
    let mounted = true;
    supabase
      .from('user_profiles')
      .select('id, full_name, role')
      .then(({ data }) => mounted && setUsers(data || []));
    return () => {
      mounted = false;
    };
  }, []);

  // --- Load all tasks and subtasks live
  const fetchTasks = useCallback(async () => {
    setLoading(true);
    let query = supabase.from('tasks').select('*');
    if (selectedClient) query = query.eq('client_id', selectedClient);
    const { data: allTasks, error: taskErr } = await query;
    const { data: allSubtasks, error: subtaskErr } = await supabase
      .from('subtasks')
      .select('*');
    if (taskErr || subtaskErr)
      setError((taskErr || subtaskErr)?.message || 'Error fetching tasks');
    else setError('');
    setTasks(allTasks || []);
    setSubtasks(allSubtasks || []);
    setLoading(false);
  }, [selectedClient]);

  // --- Real-time subscription (safe cleanup)
  useEffect(() => {
    fetchTasks();

    // Create channel only once
    const channel = supabase.channel('realtime-kanban');

    channel
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'tasks' },
        fetchTasks,
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'subtasks' },
        fetchTasks,
      )
      .subscribe((status) => {
        if (status !== 'SUBSCRIBED') {
          // Optional: notify user about websocket issue
        }
      });

    channelRef.current = channel;

    return () => {
      if (channelRef.current) {
        // Unsubscribe properly
        channelRef.current.unsubscribe();
        channelRef.current = null;
      }
    };
  }, [fetchTasks]);

  // --- Filter logic
  const filteredTasks = useMemo(() => {
    let filtered = tasks;
    if (filters.project)
      filtered = filtered.filter((t) => t.project === filters.project);
    if (filters.tag)
      filtered = filtered.filter((t) => (t.tags || []).includes(filters.tag));
    if (filters.assigned_to)
      filtered = filtered.filter((t) => t.assigned_to === filters.assigned_to);
    // RBAC: only admin/super_admin see all; users see only assigned
    if (!['admin', 'super_admin'].includes(userProfile?.role)) {
      filtered = filtered.filter(
        (t) =>
          t.assigned_to === userProfile?.id || t.user_id === userProfile?.id,
      );
    }
    return filtered;
  }, [tasks, filters, userProfile]);

  // --- Board columns
  const columns = useMemo(() => {
    const obj = {};
    COLUMN_DEFS.forEach((col) => {
      obj[col.id] = {
        ...col,
        items: filteredTasks.filter(
          (t) => (t.status || 'todo').toLowerCase() === col.id,
        ),
      };
    });
    return obj;
  }, [filteredTasks]);

  // --- Subtasks by task
  const subtasksByTask = useMemo(() => {
    const byTask = {};
    for (let st of subtasks) {
      if (!byTask[st.task_id]) byTask[st.task_id] = [];
      byTask[st.task_id].push(st);
    }
    return byTask;
  }, [subtasks]);

  // --- Unique filter values
  const allProjects = useMemo(
    () => [...new Set(tasks.map((t) => t.project).filter(Boolean))],
    [tasks],
  );
  const allTags = useMemo(
    () => [...new Set(tasks.flatMap((t) => t.tags || []).filter(Boolean))],
    [tasks],
  );

  // --- Drag/drop handler (RBAC!)
  const onDragEnd = async ({ source, destination }) => {
    if (!destination) return;
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    )
      return;
    const task = columns[source.droppableId].items[source.index];
    if (!task) return;
    // Only admin/super_admin can drag between columns
    if (!['admin', 'super_admin'].includes(userProfile?.role)) return;
    // Update task status
    await supabase
      .from('tasks')
      .update({ status: destination.droppableId })
      .eq('id', task.id);
  };

  // --- Modal handlers
  const handleEdit = (task) => {
    setEditingTask(task);
    setModalOpen(true);
  };
  const handleAdd = () => {
    setEditingTask(null);
    setModalOpen(true);
  };
  const handleModalSave = () => {
    setModalOpen(false);
    fetchTasks();
  };

  return (
    <div className="p-4 max-w-7xl mx-auto min-h-[80vh] flex flex-col">
      {/* Filters */}
      <div className="flex gap-2 mb-4 flex-wrap">
        <select
          className="email-input"
          value={filters.project}
          onChange={(e) =>
            setFilters((f) => ({ ...f, project: e.target.value }))
          }
        >
          <option value="">All Projects</option>
          {allProjects.map((proj) => (
            <option key={proj} value={proj}>
              {proj}
            </option>
          ))}
        </select>
        <select
          className="email-input"
          value={filters.tag}
          onChange={(e) => setFilters((f) => ({ ...f, tag: e.target.value }))}
        >
          <option value="">All Tags</option>
          {allTags.map((tag) => (
            <option key={tag} value={tag}>
              {tag}
            </option>
          ))}
        </select>
        <select
          className="email-input"
          value={filters.assigned_to}
          onChange={(e) =>
            setFilters((f) => ({ ...f, assigned_to: e.target.value }))
          }
        >
          <option value="">All Assignees</option>
          {users.map((u) => (
            <option key={u.id} value={u.id}>
              {u.full_name} [{u.role}]
            </option>
          ))}
        </select>
        <button className="btn-action ml-auto" onClick={handleAdd}>
          + New Task
        </button>
      </div>
      {error && <div className="text-red-500 mb-2">{error}</div>}
      {loading ? (
        <div className="flex-grow flex items-center justify-center text-mid-gray">
          Loading tasks...
        </div>
      ) : (
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="flex flex-1 gap-6 overflow-x-auto custom-scrollbar">
            {COLUMN_DEFS.map((col) => (
              <Droppable key={col.id} droppableId={col.id}>
                {(provided, snapshot) => (
                  <motion.div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`bg-dark-gray/40 rounded-2xl p-4 flex-1 min-w-[310px] flex flex-col transition ${snapshot.isDraggingOver ? 'ring-2 ring-teal-500/70' : ''}`}
                  >
                    <div className="font-bold text-lg mb-3 text-off-white flex items-center gap-2">
                      {col.label}
                      <span className="bg-teal-800 text-teal-100 px-2 rounded text-xs">
                        {columns[col.id].items.length}
                      </span>
                    </div>
                    <div className="flex-1 min-h-[200px] overflow-y-auto custom-scrollbar space-y-3">
                      <AnimatePresence>
                        {columns[col.id].items.map((task, idx) => (
                          <Draggable
                            key={task.id}
                            draggableId={String(task.id)}
                            index={idx}
                            isDragDisabled={
                              !['admin', 'super_admin'].includes(
                                userProfile?.role,
                              )
                            }
                          >
                            {(provided, snapshot) => (
                              <motion.div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className={`bg-mid-gray rounded-xl p-3 shadow-lg border ${snapshot.isDragging ? 'border-teal-400 scale-95' : 'border-dark-gray'} transition-all cursor-grab`}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 10 }}
                                onClick={() => handleEdit(task)}
                              >
                                <div className="flex justify-between items-center gap-2">
                                  <div>
                                    <div className="font-bold text-white">
                                      {task.title}
                                    </div>
                                    <div className="text-xs text-mid-gray">
                                      {task.description?.slice(0, 60)}
                                    </div>
                                    <div className="mt-1 flex flex-wrap gap-1 text-xs">
                                      {task.priority && (
                                        <span
                                          className={`px-2 py-0.5 rounded-full ${task.priority === 'High' ? 'bg-red-700/80 text-red-100' : task.priority === 'Medium' ? 'bg-yellow-700/80 text-yellow-100' : 'bg-green-700/80 text-green-100'}`}
                                        >
                                          {task.priority}
                                        </span>
                                      )}
                                      {task.tags &&
                                        task.tags.map((tag) => (
                                          <span
                                            key={tag}
                                            className="bg-black/30 border border-teal-800 px-1 rounded"
                                          >
                                            {tag}
                                          </span>
                                        ))}
                                    </div>
                                    {/* Subtasks preview */}
                                    {subtasksByTask[task.id]?.length > 0 && (
                                      <div className="mt-2 text-xs">
                                        <span className="font-semibold">
                                          Subtasks:{' '}
                                        </span>
                                        {subtasksByTask[task.id].map((st) => (
                                          <span
                                            key={st.id}
                                            className={`inline-block mr-2 px-1 rounded-full ${st.status === 'done' ? 'bg-green-700 text-white' : 'bg-mid-gray/80 text-teal-300'}`}
                                          >
                                            {st.title}{' '}
                                            <span className="text-xs">
                                              [
                                              {users.find(
                                                (u) => u.id === st.assigned_to,
                                              )?.full_name || 'Unassigned'}
                                              ]
                                            </span>
                                            {st.status === 'done' && (
                                              <span>✔</span>
                                            )}
                                          </span>
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                  <div className="flex flex-col items-end gap-1">
                                    {task.due_date && (
                                      <span className="text-xs text-yellow-300">
                                        Due:{' '}
                                        {new Date(
                                          task.due_date,
                                        ).toLocaleDateString()}
                                      </span>
                                    )}
                                    {users.find(
                                      (u) => u.id === task.assigned_to,
                                    ) && (
                                      <span className="text-xs text-teal-300">
                                        Assigned:{' '}
                                        {
                                          users.find(
                                            (u) => u.id === task.assigned_to,
                                          )?.full_name
                                        }
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </motion.div>
                            )}
                          </Draggable>
                        ))}
                      </AnimatePresence>
                      {columns[col.id].items.length === 0 && (
                        <div className="text-mid-gray text-xs text-center py-5">
                          No tasks.
                        </div>
                      )}
                      {provided.placeholder}
                    </div>
                  </motion.div>
                )}
              </Droppable>
            ))}
          </div>
        </DragDropContext>
      )}
      <AnimatePresence>
        {modalOpen && (
          <TaskModal
            task={editingTask}
            onSave={handleModalSave}
            onClose={() => setModalOpen(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default KanbanBoard;
