import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

// Fix __dirname in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, "./.env") });

export const ENV = {
  DEADBOLT_SAFE: process.env.DEADBOLT_SAFE,
};
