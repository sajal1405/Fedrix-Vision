import React, { useState, useEffect } from 'react';
import supabase from '../../utils/supabase';

const emptyProject = {
  id: null,
  name: '',
  description: '',
  client_id: null,
  status: 'active',
};

const ProjectModal = ({ open, project, onClose, onSave }) => {
  const [form, setForm] = useState(emptyProject);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setForm(project || emptyProject);
  }, [project]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    let result;
    if (form.id) {
      result = await supabase
        .from('projects')
        .update(form)
        .eq('id', form.id)
        .select('*')
        .single();
    } else {
      result = await supabase
        .from('projects')
        .insert([form])
        .select('*')
        .single();
    }
    setSaving(false);
    if (onSave) onSave(result.data || null);
    onClose();
  };

  if (!open) return null;
  return (
    <div className="modal-backdrop">
      <div className="modal">
        <h2>{form.id ? 'Edit Project' : 'New Project'}</h2>
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Project Name"
        />
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Description"
        />
        <button onClick={handleSave} disabled={saving}>
          {saving ? 'Saving...' : 'Save'}
        </button>
        <button onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
};

export default ProjectModal;
