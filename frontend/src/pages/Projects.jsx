import React, { useEffect, useState } from 'react';
import { api } from '../api.js';

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [form, setForm] = useState({ name: '', description: '' });
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');

  const load = async () => {
    try {
      const data = await api.listProjects();
      setProjects(data);
    } catch (e) { setError(e.message); }
  };

  useEffect(() => { load(); }, []);

  const submit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.updateProject(editingId, form);
      } else {
        await api.createProject(form);
      }
      setForm({ name: '', description: '' });
      setEditingId(null);
      await load();
    } catch (e) { setError(e.message); }
  };

  const startEdit = (p) => {
    setEditingId(p.id);
    setForm({ name: p.name, description: p.description || '' });
  };

  const remove = async (id) => {
    if (!confirm('Delete this project? This will also delete its tasks.')) return;
    try { await api.deleteProject(id); await load(); } catch (e) { setError(e.message); }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow p-4">
        <h2 className="text-xl font-semibold mb-3">{editingId ? 'Edit Project' : 'Add Project'}</h2>
        <form onSubmit={submit} className="grid sm:grid-cols-3 gap-3">
          <input className="border rounded p-2" placeholder="Name" value={form.name} onChange={e=>setForm({...form, name:e.target.value})} required />
          <input className="border rounded p-2 sm:col-span-2" placeholder="Description" value={form.description} onChange={e=>setForm({...form, description:e.target.value})} />
          <div className="flex gap-2">
            <button className="px-4 py-2 rounded bg-blue-600 text-white">{editingId ? 'Update' : 'Create'}</button>
            {editingId && <button type="button" className="px-4 py-2 rounded bg-gray-200" onClick={()=>{setEditingId(null); setForm({name:'', description:''});}}>Cancel</button>}
          </div>
        </form>
        {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
      </div>

      <div className="bg-white rounded-2xl shadow">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold">Projects</h2>
        </div>
        <ul className="divide-y">
          {projects.map(p => (
            <li key={p.id} className="p-4 flex items-center gap-3">
              <div className="flex-1">
                <div className="font-medium">{p.name}</div>
                {p.description && <div className="text-sm text-gray-500">{p.description}</div>}
              </div>
              <button className="px-3 py-1 rounded bg-gray-200" onClick={()=>startEdit(p)}>Edit</button>
              <button className="px-3 py-1 rounded bg-red-600 text-white" onClick={()=>remove(p.id)}>Delete</button>
            </li>
          ))}
          {!projects.length && <li className="p-4 text-sm text-gray-500">No projects yet.</li>}
        </ul>
      </div>
    </div>
  );
}
