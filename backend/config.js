// config.js
"use strict";

// Import dotenv and colors packages using modern syntax
import dotenv from "dotenv";
import "colors";

// Load environment variables from .env file into process.env
dotenv.config();

// Define SECRET_KEY with default value using optional chaining
const SECRET_KEY = process.env.SECRET_KEY;
const JITSI_DOMAIN = process.env.JITSI_DOMAIN;
const JITSI_APP_ID = process.env.JITSI_APP_ID;
const APP_DOMAIN = process.env.APP_DOMAIN;
const FRONTEND_URL = process.env.FRONTEND;
const LIVE_URL = process.env.LIVE_URL;
const DATABASE_URL = process.env.DATABASE_URL;
const NODE_ENV = process.env.NODE_ENV;
const PORT = Number(process.env.PORT);

// Function to determine database URI based on environment
const getDatabaseUri = () =>
  process.env.NODE_ENV === "test"
    ? "postgresql:///mocrs_test"
    : process.env.DATABASE_URL || "postgresql:///mocrs";

// Set BCRYPT_WORK_FACTOR based on environment
const BCRYPT_WORK_FACTOR = process.env.NODE_ENV === "test" ? 1 : 12;

// LiveKit Configuration
export const LIVEKIT_API_KEY = process.env.LIVEKIT_API_KEY || "your_api_key";
export const LIVEKIT_API_SECRET = process.env.LIVEKIT_API_SECRET || "your_api_secret";
export const LIVEKIT_HOST = process.env.LIVEKIT_HOST || "http://localhost:7880";

// Log configuration details with colorful output
const isDevelopment = process.env.NODE_ENV === "development";
if (isDevelopment) {
  console.log("Mocrs Config:".green);
  console.log("PORT:".yellow, PORT);
  console.log("BCRYPT_WORK_FACTOR:".yellow, BCRYPT_WORK_FACTOR);
  console.log("Database:".yellow, getDatabaseUri());
  console.log("---");
  console.log("LiveKit API Key:".yellow, LIVEKIT_API_KEY);
  console.log("LiveKit API Secret:".yellow, LIVEKIT_API_SECRET ? '********' : 'NOT SET');
  console.log("LiveKit Host:".yellow, LIVEKIT_HOST);
  console.log("---");
}
// Export configuration as an object using object shorthand syntax
export {
  LIVEKIT_API_KEY,
  LIVEKIT_API_SECRET,
  LIVEKIT_HOST,
  SECRET_KEY,
  PORT,
  BCRYPT_WORK_FACTOR,
  JITSI_DOMAIN,
  JITSI_APP_ID,
  APP_DOMAIN,
  FRONTEND_URL,
  LIVE_URL,
  DATABASE_URL,
  NODE_ENV,
  getDatabaseUri,
};
