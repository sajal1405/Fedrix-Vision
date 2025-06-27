import React, { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useUserProfile } from '../../context/UserProfileContext';
import supabase from '../../utils/supabase';
import { FaTrello } from 'react-icons/fa';

const COLUMNS = [
  { status: 'todo', label: 'To Do', color: 'border-cyan-400 bg-cyan-900/30' },
  { status: 'inprogress', label: 'In Progress', color: 'border-amber-400 bg-yellow-900/30' },
  { status: 'done', label: 'Done', color: 'border-green-400 bg-green-900/30' },
];

const KanbanWidget = () => {
  const { currentUser } = useAuth();
  const { userProfile } = useUserProfile();
  const [tasks, setTasks] = useState({ todo: [], inprogress: [], done: [] });
  const [loading, setLoading] = useState(true);

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    let query = supabase.from('tasks').select('*').order('updated_at', { ascending: false }).limit(21); // Up to 7 per column
    // Role/user aware:
    if (userProfile?.role !== 'super_admin' && userProfile?.role !== 'admin') {
      query = query.eq('assigned_to', currentUser.id);
    }
    const { data } = await query;
    const grouped = { todo: [], inprogress: [], done: [] };
    (data || []).forEach((task) => {
      if (grouped[task.status]) grouped[task.status].push(task);
    });
    setTasks({
      todo: grouped.todo.slice(0, 7),
      inprogress: grouped.inprogress.slice(0, 7),
      done: grouped.done.slice(0, 7),
    });
    setLoading(false);
  }, [userProfile, currentUser]);

  useEffect(() => {
    fetchTasks(); // fetch tasks initially
    const chan = supabase
      .channel('widget_kanban')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'tasks' }, fetchTasks) // subscribe to updates
      .subscribe();
    return () => supabase.removeChannel(chan); // clean up on component unmount
  }, [fetchTasks]); // include fetchTasks in dependencies array

  return (
    <div className="glassy-tile rounded-3xl p-6 shadow-xl border border-teal-200/20 bg-gradient-to-br from-teal-900/70 via-teal-800/30 to-teal-700/40 backdrop-blur-lg relative overflow-x-auto min-h-[230px] animate-fade-in">
      <div className="flex items-center gap-2 mb-5">
        <FaTrello className="text-teal-300 text-2xl animate-glow" />
        <span className="text-lg font-semibold text-teal-100">Kanban Board Preview</span>
        <a href="/kanban" className="ml-auto text-xs text-teal-300 hover:underline font-semibold">
          Open Kanban Board →
        </a>
      </div>
      <div className="flex gap-5 overflow-x-auto">
        {COLUMNS.map((col) => (
          <div
            key={col.status}
            className={`flex-1 min-w-[160px] border-2 ${col.color} rounded-2xl p-3`}
            style={{ minHeight: '170px' }}
          >
            <div className="text-md font-semibold mb-2 text-white/90">{col.label}</div>
            {loading ? (
              <div className="text-white/40">Loading...</div>
            ) : tasks[col.status].length === 0 ? (
              <div className="text-white/40 italic">No tasks</div>
            ) : (
              tasks[col.status].map((task) => (
                <div
                  key={task.id}
                  className="bg-black/20 rounded-xl mb-2 px-3 py-2 text-white/90 text-sm flex items-center gap-2 shadow"
                >
                  <span className="truncate font-medium">{task.title || 'Untitled'}</span>
                  {task.priority && (
                    <span
                      className={`ml-auto text-xs px-2 py-0.5 rounded ${
                        task.priority === 'high'
                          ? 'bg-red-700 text-red-200'
                          : task.priority === 'low'
                          ? 'bg-emerald-800 text-emerald-200'
                          : 'bg-gray-800 text-gray-200'
                      }`}
                    >
                      {task.priority}
                    </span>
                  )}
                </div>
              ))
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default KanbanWidget;
