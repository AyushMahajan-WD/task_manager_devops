const API_URL = import.meta.env.VITE_API_URL || 'http://129.154.247.171:30001';

async function http(method, path, body) {
  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || 'Request failed');
  }
  if (res.status === 204) return null;
  return res.json();
}

export const api = {
  // Health
  health: () => http('GET', '/health'),

  // Projects
  listProjects: () => http('GET', '/api/projects'),
  getProject: (id) => http('GET', `/api/projects/${id}`),
  createProject: (data) => http('POST', '/api/projects', data),
  updateProject: (id, data) => http('PUT', `/api/projects/${id}`, data),
  deleteProject: (id) => http('DELETE', `/api/projects/${id}`),

  // Tasks
  listTasks: (project_id) => http('GET', `/api/tasks${project_id ? `?project_id=${project_id}` : ''}`),
  getTask: (id) => http('GET', `/api/tasks/${id}`),
  createTask: (data) => http('POST', '/api/tasks', data),
  updateTask: (id, data) => http('PUT', `/api/tasks/${id}`, data),
  deleteTask: (id) => http('DELETE', `/api/tasks/${id}`)
};
