export default {
  env: 'production',
  port: process.env.PORT || 4000,
  db: {
    host: process.env.PGHOST,
    port: +(process.env.PGPORT || 5432),
    database: process.env.PGDATABASE,
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    ssl: process.env.PGSSL === 'true' ? { rejectUnauthorized: false } : false
  },
  allowedHosts: (process.env.ALLOWED_HOSTS || '').split(',').map(s => s.trim()).filter(Boolean)
};
