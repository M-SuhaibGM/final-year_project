// prisma.config.js
import { defineConfig } from '@prisma/config';
import path from 'path';
import fs from 'fs';

// Manually parse .env if process.env is empty
if (!process.env.DATABASE_URL) {
  const envPath = path.resolve(process.cwd(), '.env');
  if (fs.existsSync(envPath)) {
    const envConfig = fs.readFileSync(envPath, 'utf-8');
    envConfig.split('\n').forEach(line => {
      const [key, value] = line.split('=');
      if (key && value) {
        process.env[key.trim()] = value.trim().replace(/['"']/g, '');
      }
    });
  }
}

export default defineConfig({
  datasource: {
    url: process.env.DATABASE_URL,
  },
});