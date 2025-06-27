// src/context/ClientContext.js
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from 'react';
import supabase from '../utils/supabase';
import { useUserProfile } from './UserProfileContext';

const ClientContext = createContext(null);

export function useClientContext() {
  return useContext(ClientContext);
}

export function ClientProvider({ children }) {
  const { userProfile } = useUserProfile();
  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch clients for this user
  const fetchClients = useCallback(async () => {
    setLoading(true);
    try {
      if (
        userProfile?.role === 'super_admin' ||
        userProfile?.role === 'admin'
      ) {
        const { data, error } = await supabase
          .from('clients')
          .select('*')
          .order('created_at');
        if (error) throw error;
        setClients(data || []);
      } else if (userProfile?.id) {
        // Only show clients assigned to this user
        const { data: joined, error: joinError } = await supabase
          .from('client_users')
          .select('client_id')
          .eq('user_id', userProfile.id);
        if (joinError) throw joinError;
        const ids = (joined || []).map((j) => j.client_id);
        if (ids.length > 0) {
          const { data: userClients, error: clientError } = await supabase
            .from('clients')
            .select('*')
            .in('id', ids);
          if (clientError) throw clientError;
          setClients(userClients || []);
        } else {
          setClients([]);
        }
      } else {
        setClients([]);
      }
    } catch (err) {
      setClients([]);
    }
    setLoading(false);
  }, [userProfile]);

  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  // Reset selected client if not in available clients
  useEffect(() => {
    if (selectedClient && !clients.find((c) => c.id === selectedClient)) {
      setSelectedClient(null);
    }
  }, [clients, selectedClient]);

  return (
    <ClientContext.Provider
      value={{ clients, selectedClient, setSelectedClient, loading }}
    >
      {children}
    </ClientContext.Provider>
  );
}
