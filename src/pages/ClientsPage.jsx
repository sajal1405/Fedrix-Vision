import React, { useState, useEffect } from 'react';
import supabase from '../utils/supabase';
import { useUserProfile } from '../context/UserProfileContext';
import { FaPlus, FaTrashAlt, FaEdit } from 'react-icons/fa';

export default function ClientsPage() {
  const { userProfile } = useUserProfile();
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editClient, setEditClient] = useState(null);
  const [form, setForm] = useState({ name: '', website: '', notes: '' });

  const canEdit =
    userProfile?.role === 'admin' || userProfile?.role === 'super_admin';

  async function fetchClients() {
    setLoading(true);
    const { data } = await supabase
      .from('clients')
      .select('*')
      .order('created_at');
    setClients(data || []);
    setLoading(false);
  }

  useEffect(() => {
    fetchClients();
  }, []);

  function openEdit(c) {
    setEditClient(c);
    setForm({ name: c.name, website: c.website || '', notes: c.notes || '' });
    setShowModal(true);
  }
  function openAdd() {
    setEditClient(null);
    setForm({ name: '', website: '', notes: '' });
    setShowModal(true);
  }

  async function saveClient(e) {
    e.preventDefault();
    if (editClient) {
      await supabase.from('clients').update(form).eq('id', editClient.id);
    } else {
      await supabase.from('clients').insert([form]);
    }
    setShowModal(false);
    fetchClients();
  }

  async function deleteClient(id) {
    if (
      !window.confirm(
        'Delete this client/brand? This will remove all its data!',
      )
    )
      return;
    await supabase.from('clients').delete().eq('id', id);
    fetchClients();
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">Clients / Brands</h2>
        {canEdit && (
          <button
            onClick={openAdd}
            className="btn-action flex items-center px-4 py-2 rounded-md"
          >
            <FaPlus className="mr-2" /> Add Brand
          </button>
        )}
      </div>
      <div className="bg-dark-gray/70 p-6 rounded-lg shadow border border-mid-gray">
        {loading ? (
          <p>Loading...</p>
        ) : (
          <table className="w-full text-left">
            <thead>
              <tr>
                <th className="pb-2 text-white/80">Name</th>
                <th className="pb-2 text-white/80">Website</th>
                <th className="pb-2 text-white/80">Notes</th>
                {canEdit && <th className="pb-2"></th>}
              </tr>
            </thead>
            <tbody>
              {clients.map((c) => (
                <tr
                  key={c.id}
                  className="border-b border-mid-gray last:border-0"
                >
                  <td className="py-3">{c.name}</td>
                  <td>
                    {c.website ? (
                      <a
                        href={c.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-teal-300"
                      >
                        {c.website}
                      </a>
                    ) : (
                      <span className="text-mid-gray">—</span>
                    )}
                  </td>
                  <td>{c.notes || <span className="text-mid-gray">—</span>}</td>
                  {canEdit && (
                    <td>
                      <button
                        onClick={() => openEdit(c)}
                        className="mr-2 text-blue-400 hover:text-blue-300"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => deleteClient(c.id)}
                        className="text-red-400 hover:text-red-300"
                      >
                        <FaTrashAlt />
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <form
            onSubmit={saveClient}
            className="bg-dark-gray p-8 rounded-lg shadow-xl w-full max-w-md"
          >
            <h3 className="text-xl font-semibold text-white mb-4">
              {editClient ? 'Edit' : 'Add'} Brand
            </h3>
            <label className="block mb-2 text-sm text-light-gray">
              Brand Name
            </label>
            <input
              className="w-full mb-4 rounded-md px-3 py-2 bg-mid-gray/30 text-white border border-mid-gray"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              required
            />
            <label className="block mb-2 text-sm text-light-gray">
              Website
            </label>
            <input
              className="w-full mb-4 rounded-md px-3 py-2 bg-mid-gray/30 text-white border border-mid-gray"
              value={form.website}
              onChange={(e) =>
                setForm((f) => ({ ...f, website: e.target.value }))
              }
            />
            <label className="block mb-2 text-sm text-light-gray">Notes</label>
            <textarea
              className="w-full mb-4 rounded-md px-3 py-2 bg-mid-gray/30 text-white border border-mid-gray"
              value={form.notes}
              onChange={(e) =>
                setForm((f) => ({ ...f, notes: e.target.value }))
              }
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button type="submit" className="btn-primary">
                {editClient ? 'Save' : 'Add'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
