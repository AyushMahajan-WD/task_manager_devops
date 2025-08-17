import { query } from '../db.js';

export async function listTasks(req, res) {
  const { project_id } = req.query;
  let sql = 'SELECT * FROM tasks';
  let params = [];
  if (project_id) {
    sql += ' WHERE project_id=$1';
    params.push(project_id);
  }
  sql += ' ORDER BY id DESC';
  const { rows } = await query(sql, params);
  res.json(rows);
}

export async function getTask(req, res) {
  const { id } = req.params;
  const { rows } = await query('SELECT * FROM tasks WHERE id=$1', [id]);
  if (!rows.length) return res.status(404).json({ error: 'Task not found' });
  res.json(rows[0]);
}

export async function createTask(req, res) {
  const { project_id, title, description, status } = req.body;
  if (!project_id) return res.status(400).json({ error: 'project_id is required' });
  if (!title) return res.status(400).json({ error: 'title is required' });
  const { rows } = await query(
    'INSERT INTO tasks (project_id, title, description, status) VALUES ($1, $2, $3, COALESCE($4, \'todo\')) RETURNING *',
    [project_id, title, description || null, status]
  );
  res.status(201).json(rows[0]);
}

export async function updateTask(req, res) {
  const { id } = req.params;
  const { title, description, status, project_id } = req.body;
  const { rows } = await query(
    'UPDATE tasks SET title=COALESCE($1,title), description=COALESCE($2,description), status=COALESCE($3,status), project_id=COALESCE($4,project_id), updated_at=NOW() WHERE id=$5 RETURNING *',
    [title, description, status, project_id, id]
  );
  if (!rows.length) return res.status(404).json({ error: 'Task not found' });
  res.json(rows[0]);
}

export async function deleteTask(req, res) {
  const { id } = req.params;
  const { rowCount } = await query('DELETE FROM tasks WHERE id=$1', [id]);
  if (!rowCount) return res.status(404).json({ error: 'Task not found' });
  res.status(204).send();
}
