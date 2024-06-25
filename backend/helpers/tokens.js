import jwt from "jsonwebtoken";
import colors from "colors";
import { SECRET_KEY, APP_DOMAIN, JITSI_APP_ID } from "../config.js";

/**
 * Return signed JWT from user data.
 * @param {Object} user - The user object containing user data.
 * @returns {string} - The signed JWT.
 */
function createToken(user) {
  console.assert(
    user.isAdmin !== undefined,
    "createToken passed user without isAdmin property"
  );

  const payload = {
    username: user.username,
    isAdmin: user.isAdmin || false,
  };

  return jwt.sign(payload, SECRET_KEY);
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
