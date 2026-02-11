import dotenv from "dotenv";
import path from "path";

export function loadTestEnv(): void {
  dotenv.config({ path: path.resolve(__dirname, "../.env.test") });
}

export function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required env var: ${name}`);
  }
  return value;
}
