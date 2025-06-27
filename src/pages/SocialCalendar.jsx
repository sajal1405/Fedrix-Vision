import React, { useEffect, useState } from 'react';
import { useClientContext } from '../context/ClientContext';
import supabase from '../utils/supabase';

const SocialCalendar = () => {
  const { clients, selectedClient } = useClientContext();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [clientFilter, setClientFilter] = useState(selectedClient || '');

  useEffect(() => {
    fetchEvents();
    // eslint-disable-next-line
  }, [clientFilter]);

  async function fetchEvents() {
    setLoading(true);
    let query = supabase.from('scheduled_posts').select(`
      id, title, content, scheduled_at, user_id,
      clients!inner(id, name)
    `);
    if (clientFilter) {
      query = query.eq('clients.id', clientFilter);
    }
    const { data } = await query.order('scheduled_at', { ascending: true });
    setEvents(data || []);
    setLoading(false);
  }

  return (
    <div className="w-full max-w-5xl mx-auto py-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-white">Social Media Calendar</h2>
        <div>
          <select
            className="bg-dark-gray text-white px-3 py-1 rounded-md border border-mid-gray"
            value={clientFilter}
            onChange={(e) => setClientFilter(e.target.value)}
          >
            <option value="">All Clients</option>
            {clients.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>
      {loading ? (
        <div className="text-center py-10 text-lg text-gray-300">
          Loading events...
        </div>
      ) : (
        <div className="space-y-4">
          {events.map((ev) => (
            <div
              key={ev.id}
              className="bg-mid-gray rounded-lg p-4 shadow flex flex-col sm:flex-row sm:items-center"
            >
              <div className="flex-1">
                <div className="font-semibold text-teal-400">
                  {ev.clients?.name || 'Unknown Client'}
                </div>
                <div className="text-xl font-bold">{ev.title}</div>
                <div className="text-gray-200 mt-1">{ev.content}</div>
              </div>
              <div className="text-right">
                <span className="bg-teal-800/80 px-3 py-1 rounded-full text-sm text-white font-semibold">
                  {ev.scheduled_at
                    ? new Date(ev.scheduled_at).toLocaleString()
                    : 'TBD'}
                </span>
              </div>
            </div>
          ))}
          {events.length === 0 && (
            <div className="text-center py-10 text-lg text-gray-300">
              No upcoming activities.
            </div>
          )}
        </div>
      )}
    </div>
  );
};
export default SocialCalendar;
