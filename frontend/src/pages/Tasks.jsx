import React, { useEffect, useState } from 'react';
import { api } from '../api.js';

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [form, setForm] = useState({ project_id: '', title: '', description: '', status: 'todo' });
  const [editingId, setEditingId] = useState(null);
  const [filterProject, setFilterProject] = useState('');
  const [error, setError] = useState('');

  const load = async () => {
    try {
      const [ts, ps] = await Promise.all([api.listTasks(filterProject || undefined), api.listProjects()]);
      setTasks(ts);
      setProjects(ps);
    } catch (e) { setError(e.message); }
  };

  useEffect(() => { load(); }, [filterProject]);

  const submit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.updateTask(editingId, form);
      } else {
        await api.createTask(form);
      }
      setForm({ project_id: '', title: '', description: '', status: 'todo' });
      setEditingId(null);
      await load();
    } catch (e) { setError(e.message); }
  };

  const startEdit = (t) => {
    setEditingId(t.id);
    setForm({ project_id: t.project_id, title: t.title, description: t.description || '', status: t.status });
  };

  const remove = async (id) => {
    if (!confirm('Delete this task?')) return;
    try { await api.deleteTask(id); await load(); } catch (e) { setError(e.message); }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow p-4">
        <div className="flex items-end gap-3 flex-wrap">
          <div className="flex-1">
            <h2 className="text-xl font-semibold mb-3">{editingId ? 'Edit Task' : 'Add Task'}</h2>
            <form onSubmit={submit} className="grid sm:grid-cols-4 gap-3">
              <select className="border rounded p-2" value={form.project_id} onChange={e=>setForm({...form, project_id:e.target.value})} required>
                <option value="">Select project</option>
                {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
              <input className="border rounded p-2" placeholder="Title" value={form.title} onChange={e=>setForm({...form, title:e.target.value})} required />
              <input className="border rounded p-2" placeholder="Description" value={form.description} onChange={e=>setForm({...form, description:e.target.value})} />
              <select className="border rounded p-2" value={form.status} onChange={e=>setForm({...form, status:e.target.value})}>
                <option value="todo">Todo</option>
                <option value="in_progress">In Progress</option>
                <option value="done">Done</option>
              </select>
              <div className="flex gap-2 sm:col-span-4">
                <button className="px-4 py-2 rounded bg-blue-600 text-white">{editingId ? 'Update' : 'Create'}</button>
                {editingId && <button type="button" className="px-4 py-2 rounded bg-gray-200" onClick={()=>{setEditingId(null); setForm({ project_id:'', title:'', description:'', status:'todo'});}}>Cancel</button>}
              </div>
            </form>
            {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
          </div>

          <div className="min-w-[200px]">
            <label className="block text-sm mb-1">Filter by Project</label>
            <select className="border rounded p-2 w-full" value={filterProject} onChange={e=>setFilterProject(e.target.value)}>
              <option value="">All</option>
              {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold">Tasks</h2>
        </div>
        <ul className="divide-y">
          {tasks.map(t => (
            <li key={t.id} className="p-4 grid sm:grid-cols-6 gap-3 items-center">
              <div className="sm:col-span-2">
                <div className="font-medium">{t.title}</div>
                {t.description && <div className="text-sm text-gray-500">{t.description}</div>}
              </div>
              <div className="text-sm text-gray-600">Project: {projects.find(p=>p.id===t.project_id)?.name || t.project_id}</div>
              <div>
                <span className={
                  'px-2 py-1 text-xs rounded ' + 
                  (t.status==='done' ? 'bg-green-100 text-green-700' :
                   t.status==='in_progress' ? 'bg-yellow-100 text-yellow-700' :
                   'bg-gray-100 text-gray-700')
                }>
                  {t.status.replace('_',' ')}
                </span>
              </div>
              <div className="flex gap-2">
                <button className="px-3 py-1 rounded bg-gray-200" onClick={()=>startEdit(t)}>Edit</button>
                <button className="px-3 py-1 rounded bg-red-600 text-white" onClick={()=>remove(t.id)}>Delete</button>
              </div>
            </li>
          ))}
          {!tasks.length && <li className="p-4 text-sm text-gray-500">No tasks yet.</li>}
        </ul>
      </div>
    </div>
  );
}
