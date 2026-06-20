import { createClient } from "@libsql/client";

// Función para limpiar comillas al inicio y final del valor
function cleanEnvValue(value: string | undefined): string | undefined {
  if (!value) return value;
  return value.replace(/^["']|["']$/g, "");
}

const databaseUrl = cleanEnvValue(process.env.TURSO_DATABASE_URL);
const authToken = cleanEnvValue(process.env.TURSO_AUTH_TOKEN);

if (!databaseUrl) {
  throw new Error("Falta TURSO_DATABASE_URL en .env.local");
}

if (!authToken) {
  throw new Error("Falta TURSO_AUTH_TOKEN en .env.local");
}

export const db = createClient({
  url: databaseUrl,
  authToken: authToken,
});