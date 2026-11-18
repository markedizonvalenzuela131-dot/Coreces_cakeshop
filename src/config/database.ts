// ============================================================================
// SweetCrumb Bakery - Database Configuration
// ============================================================================

import { DatabaseConfig } from '@/database/adapters';

// -----------------------------------------------------------------------------
// Database Configuration
// Choose your database type and configure accordingly
// -----------------------------------------------------------------------------

const env = (import.meta as ImportMeta & { env?: Record<string, string | undefined> }).env ?? {};

// For development with in-memory adapter (no database needed)
export const devDatabaseConfig: DatabaseConfig = {
  type: 'custom',
  customAdapter: undefined,
};

// For production with Supabase
export const supabaseDatabaseConfig: DatabaseConfig = {
  type: 'supabase',
  supabaseUrl: env.VITE_SUPABASE_URL || '',
  supabaseKey: env.VITE_SUPABASE_ANON_KEY || '',
};

// For production with PostgreSQL
export const postgresDatabaseConfig: DatabaseConfig = {
  type: 'postgresql',
  connectionString: env.DATABASE_URL || '',
  ssl: true,
};

// For production with MySQL
export const mysqlDatabaseConfig: DatabaseConfig = {
  type: 'mysql',
  host: env.DB_HOST || 'localhost',
  port: parseInt(env.DB_PORT || '3306'),
  database: env.DB_NAME || 'sweetcrumb',
  username: env.DB_USER || 'root',
  password: env.DB_PASSWORD || '',
  ssl: false,
};

// For production with SQLite
export const sqliteDatabaseConfig: DatabaseConfig = {
  type: 'sqlite',
  database: './sweetcrumb.db',
};

// -----------------------------------------------------------------------------
// Get Active Configuration
// -----------------------------------------------------------------------------

export function getDatabaseConfig(): DatabaseConfig {
  const dbType = env.VITE_DB_TYPE || 'memory';

  switch (dbType) {
    case 'supabase':
      return supabaseDatabaseConfig;
    case 'postgresql':
      return postgresDatabaseConfig;
    case 'mysql':
      return mysqlDatabaseConfig;
    case 'sqlite':
      return sqliteDatabaseConfig;
    case 'memory':
    default:
      return devDatabaseConfig;
  }
}

// -----------------------------------------------------------------------------
// Database Type for Environment
// -----------------------------------------------------------------------------

export type DatabaseType = 'memory' | 'supabase' | 'postgresql' | 'mysql' | 'sqlite' | 'prisma' | 'drizzle' | 'firebase';

// Default export for easy importing
export default getDatabaseConfig;