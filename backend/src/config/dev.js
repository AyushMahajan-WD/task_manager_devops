export default {
  env: 'development',
  port: process.env.PORT || 4000,
  db: {
    host: process.env.PGHOST || 'localhost',
    port: +(process.env.PGPORT || 5432),
    database: process.env.PGDATABASE || 'pern_task_manager',
    user: process.env.PGUSER || 'postgres',
    password: process.env.PGPASSWORD || 'postgres',
    ssl: false
  },
  allowedHosts: (process.env.ALLOWED_HOSTS || 'localhost,127.0.0.1').split(',').map(s => s.trim())
};
