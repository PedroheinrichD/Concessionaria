import { defineConfig, env } from "prisma/config";

// Prisma 7 nao carrega .env automaticamente quando existe prisma.config.ts.
// Node 20.12+ tem process.loadEnvFile nativo.
process.loadEnvFile(".env");

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  // Usado por migrate / db execute / db pull / studio. Nao vai para o client.
  datasource: {
    url: env("DATABASE_URL"),
  },
});
