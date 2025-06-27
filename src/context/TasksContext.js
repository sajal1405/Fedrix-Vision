import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from 'react';
import supabase from '../utils/supabase';
import { useAuth } from './AuthContext';
import { useUserProfile } from './UserProfileContext';
import { useClientContext } from './ClientContext';

const TasksContext = createContext(null);

export function useTasks() {
  return useContext(TasksContext);
}

export function TasksProvider({ children }) {
  const { user } = useAuth();
  const { userProfile } = useUserProfile();
  const { selectedClient } = useClientContext();

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // RBAC: Super/admin see all, client sees only own, user sees only own assigned
  const fetchTasks = useCallback(
    async (filter = {}) => {
      if (!user) return;
      setLoading(true);

      let query = supabase.from('tasks').select('*');
      if (
        userProfile?.role === 'super_admin' ||
        userProfile?.role === 'admin'
      ) {
        if (filter.client_id) query = query.eq('client_id', filter.client_id);
        if (filter.project) query = query.eq('project', filter.project);
        if (filter.tags && filter.tags.length > 0)
          query = query.overlaps('tags', filter.tags);
      } else {
        query = query.eq('user_id', user.id);
        if (filter.client_id) query = query.eq('client_id', filter.client_id);
        if (filter.project) query = query.eq('project', filter.project);
        if (filter.tags && filter.tags.length > 0)
          query = query.overlaps('tags', filter.tags);
      }
      query = query.order('created_at', { ascending: false });
      const { data, error } = await query;
      if (error) {
        setError(error);
        setTasks([]);
      } else {
        setTasks(data || []);
        setError(null);
      }
      setLoading(false);
    },
    [user, userProfile],
  );

  useEffect(() => {
    fetchTasks();
  }, [user, userProfile, selectedClient, fetchTasks]);

  return (
    <TasksContext.Provider value={{ tasks, fetchTasks, loading, error }}>
      {children}
    </TasksContext.Provider>
  );
}
