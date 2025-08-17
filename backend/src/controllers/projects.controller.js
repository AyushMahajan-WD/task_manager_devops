import { query } from '../db.js';

export async function listProjects(req, res) {
  const { rows } = await query('SELECT * FROM projects ORDER BY id DESC');
  res.json(rows);
}

export async function getProject(req, res) {
  const { id } = req.params;
  const { rows } = await query('SELECT * FROM projects WHERE id=$1', [id]);
  if (!rows.length) return res.status(404).json({ error: 'Project not found' });
  res.json(rows[0]);
}

export async function createProject(req, res) {
  const { name, description } = req.body;
  if (!name) return res.status(400).json({ error: 'Name is required' });
  const { rows } = await query(
    'INSERT INTO projects (name, description) VALUES ($1, $2) RETURNING *',
    [name, description || null]
  );
  res.status(201).json(rows[0]);
}

export async function updateProject(req, res) {
  const { id } = req.params;
  const { name, description } = req.body;
  const { rows } = await query(
    'UPDATE projects SET name=COALESCE($1,name), description=COALESCE($2,description), updated_at=NOW() WHERE id=$3 RETURNING *',
    [name, description, id]
  );
  if (!rows.length) return res.status(404).json({ error: 'Project not found' });
  res.json(rows[0]);
}

export async function deleteProject(req, res) {
  const { id } = req.params;
  // Cascade deletes tasks via FK ON DELETE CASCADE
  const { rowCount } = await query('DELETE FROM projects WHERE id=$1', [id]);
  if (!rowCount) return res.status(404).json({ error: 'Project not found' });
  res.status(204).send();
}
