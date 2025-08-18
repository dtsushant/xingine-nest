import { defineConfig } from '@mikro-orm/postgresql';
import { User } from './src/entities/user.entity';
import { Company } from './src/entities/company.entity';
import { Phone } from './src/entities/phone.entity';

const config = defineConfig({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT) || 5444,
  user: process.env.DB_USER || 'admin',
  password: process.env.DB_PASSWORD || 'admin',
  dbName: process.env.DB_NAME || 'unipolis',
  entities: [User, Company, Phone],
  migrations: {
    path: './src/migrations',
    pathTs: './src/migrations',
  },
  seeder: {
    path: './src/seeders',
    pathTs: './src/seeders',
  },
  debug: process.env.NODE_ENV !== 'production',
  allowGlobalContext: true,
});

export default config;
