import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from 'react';
import supabase from '../utils/supabase';
import { useUserProfile } from './UserProfileContext';

const NotificationsContext = createContext();

export const useNotifications = () => useContext(NotificationsContext);

export const NotificationsProvider = ({ children }) => {
  const { userProfile } = useUserProfile();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [notifError, setNotifError] = useState(null);

  const fetchNotifications = useCallback(async () => {
    if (!userProfile?.id) {
      setNotifications([]);
      return;
    }
    setLoading(true);
    setNotifError(null);
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userProfile.id)
        .order('created_at', { ascending: false })
        .limit(50);
      if (error) throw error;
      setNotifications(data || []);
    } catch (err) {
      setNotifError(err);
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  }, [userProfile]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const markAsRead = async (id) => {
    try {
      await supabase.from('notifications').update({ read: true }).eq('id', id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
      );
    } catch (err) {
      setNotifError(err);
    }
  };

  const markAllAsRead = async () => {
    if (!userProfile?.id) return;
    try {
      await supabase
        .from('notifications')
        .update({ read: true })
        .eq('user_id', userProfile.id);
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    } catch (err) {
      setNotifError(err);
    }
  };

  const deleteNotification = async (id) => {
    try {
      await supabase.from('notifications').delete().eq('id', id);
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    } catch (err) {
      setNotifError(err);
    }
  };

  return (
    <NotificationsContext.Provider
      value={{
        notifications,
        loading,
        notifError,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        fetchNotifications,
      }}
    >
      {children}
    </NotificationsContext.Provider>
  );
};
