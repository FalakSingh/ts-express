import path from "path";
import dotenv from "dotenv";
import logger from "@logger";

const environment: string = process.env.NODE_ENV ?? "local";

const { error } = dotenv.config({
  path: path.resolve(__dirname, `../../.env.${environment}`),
});

if (error) {
  logger.error("Error loading Env file:", error);
} else {
  console.log("Env file loaded successfully");
}
