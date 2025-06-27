import React, { useEffect, useState } from 'react';
import { supabase } from '../../supabaseClient';
import { useOutletContext } from 'react-router-dom';
export default function AnalyticsPanel() {
  const { client } = useOutletContext();
  const [metrics, setMetrics] = useState(null);

  useEffect(() => {
    if (!client?.id) return;
    // Example: Fetch web analytics for this brand
    supabase
      .from('web_analytics')
      .select('*')
      .eq('client_id', client.id)
      .then(({ data }) => setMetrics(data));
  }, [client?.id]);

  if (!client?.id) return <div>Select a brand.</div>;
  if (!metrics) return <div>Loading...</div>;
  return (
    <div>
      <h2 className="text-2xl text-white font-bold mb-4">
        Web Analytics – {client.name}
      </h2>
      {/* Render analytics graphs or KPIs for this brand */}
      {/* ... */}
    </div>
  );
}
