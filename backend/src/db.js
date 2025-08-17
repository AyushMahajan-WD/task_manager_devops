import pg from 'pg';
import config from './config/index.js';
const { Pool } = pg;

const pool = new Pool({
  host: config.db.host,
  port: config.db.port,
  database: config.db.database,
  user: config.db.user,
  password: config.db.password,
  ssl: config.db.ssl || false
});

export const query = (text, params) => pool.query(text, params);
export const getClient = () => pool.connect();
