import jwt from "jsonwebtoken";
import "colors";
import { SECRET_KEY, APP_DOMAIN, JITSI_APP_ID } from "../config.js";

function createToken(user) {
  const isAdmin = user.isAdmin !== undefined ? user.isAdmin : false;
  const payload = {
    username: user.username,
    isAdmin: isAdmin,
  };
  try {
    const token = jwt.sign(payload, SECRET_KEY, { algorithm: "HS256" });
    console.log(`Token created: ${token}`.green);
    console.log(`Token assigned to: ${user.username}`.green);
    return token;
  } catch (error) {
    console.error("Error creating token:", error.message);
    throw error;
  }
}

function generateJitsiToken(user) {
  console.log(`User established: ${user.username}`.blue);
  const now = Math.floor(Date.now() / 1000);
  const jwt_payload = {
    aud: "jitsi",
    iss: JITSI_APP_ID,
    sub: APP_DOMAIN,
    room: "*",
    context: {
      user: {
        name: user.firstName || "Guest",
        email: user.email || "",
        affiliation: "member",
        role: "participant",
      },
    },
    moderator: user.moderator || false,
    iat: now,
    exp: now + 24 * 3600, // Token expires in 24 hours
    nbf: now - 10, // Token is valid from 10 seconds ago
  };

  try {
    const token = jwt.sign(jwt_payload, SECRET_KEY, { algorithm: "HS256" });
    return token;
  } catch (error) {
    console.error("Error generating Jitsi token:", error.message, error.stack);
    throw new Error("Failed to generate Jitsi token");
  }
}
export { createToken, generateJitsiToken };
