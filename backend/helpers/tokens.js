import jwt from "jsonwebtoken";
import "colors";
import { AccessToken } from 'livekit-server-sdk'; // New import
import { SECRET_KEY, APP_DOMAIN, JITSI_APP_ID, LIVEKIT_API_KEY, LIVEKIT_API_SECRET, LIVEKIT_HOST } from "../config.js"; // Add LiveKit vars

function createToken(user) {
  const isAdmin = user.isAdmin !== undefined ? user.isAdmin : false;
  const payload = {
    username: user.username,
    isAdmin: isAdmin,
  };
  try {
    const token = jwt.sign(payload, SECRET_KEY, { algorithm: "HS256" });
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

/**
 * Generate a LiveKit access token.
 * @param {Object} user - User information (e.g., { identity: 'username', name: 'Display Name' }).
 * @param {string} roomName - The name of the room to join.
 * @param {boolean} isModerator - Optional: grants canJoin, canPublish, canSubscribe, roomCreate, roomAdmin.
 * @returns {string} LiveKit JWT token.
 */
export function generateLiveKitToken(user, roomName, isModerator = false) {
  const at = new AccessToken(LIVEKIT_API_KEY, LIVEKIT_API_SECRET, {
    identity: user.identity || user.username, // Use user.identity if provided, else fallback to username
    name: user.name || user.firstName, // Use user.name if provided, else fallback to firstName
    // ttl: '10m', // Optional: token validity period
  });

  at.addGrant({
    room: roomName,
    roomJoin: true,
    canPublish: isModerator || true, // Allow publishing by default, or if moderator
    canSubscribe: true,
    // More granular permissions can be set if needed:
    // roomCreate: isModerator,
    // roomAdmin: isModerator,
    // canPublishData: true,
    // hidden: false, // if participant should be hidden from others
  });

  // If isModerator, grant additional privileges
  if (isModerator) {
    at.addGrant({
        roomCreate: true,
        roomAdmin: true,
    });
  }

  console.log(`Generated LiveKit token for user: ${user.identity || user.username} in room: ${roomName}`);
  return at.toJwt();
}
export { createToken, generateJitsiToken, generateLiveKitToken };
