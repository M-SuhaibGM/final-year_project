import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "@prisma/client";

const adapter = new PrismaMariaDb({
  host: "localhost",
  port: 3306,
  connectionLimit: 5,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});
const prisma = new PrismaClient({ adapter });
export { prisma };