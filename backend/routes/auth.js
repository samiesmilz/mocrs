"use strict";

import express from "express";
import jwt from "jsonwebtoken";
import User from "../models/user.js";
import userAuthSchema from "../schemas/userAuth.js";
import userRegisterSchema from "../schemas/userRegister.js";
import { SECRET_KEY } from "../config.js";
import { generateJitsiToken, createToken, generateLiveKitToken } from "../helpers/tokens.js"; // Add generateLiveKitToken
import "colors";
import validateSchema from "../middleware/validateSchema.js";

const router = express.Router();

/**
 * POST /auth/login:  { username, password } => { token }
 * Returns JWT token which can be used to authenticate further requests.
 * Authorization required: none
 */
router.post(
  "/login",
  validateSchema(userAuthSchema),
  async (req, res, next) => {
    try {
      const { username, password } = req.body;
      const user = await User.authenticate(username, password);
      const token = createToken(user);
      return res.json({ user, token });
    } catch (err) {
      next(err);
    }
  }
);

/**
 * POST /auth/register:   { user } => { token }
 * user must include { username, password, firstName, lastName, email }
 * Returns JWT token which can be used to authenticate further requests.
 * Authorization required: none
 */
router.post(
  "/register",
  validateSchema(userRegisterSchema),
  async (req, res, next) => {
    try {
      const newUser = await User.register({ ...req.body, isAdmin: false });
      const token = createToken(newUser);
      return res.status(201).json({ newUser, token });
    } catch (err) {
      next(err);
    }
  }
);

/**
 * POST /auth/jtoken
 * Generates a JWT token for Jitsi integration based on user authentication token.
 * Expects { token } in headers or body and { username, email } in body.
 * Returns { token } upon successful authentication.
 * Authorization required: none explicitly, but handled implicitly via token.
 */
router.post("/jtoken", (req, res) => {
  let user = req.body.user;
  if (user && user.token) {
    const token = user.token;
    try {
      const decoded = jwt.verify(token, SECRET_KEY);
      user = { ...user, moderator: true };
    } catch (tokenError) {
      return res.status(401).json({ error: "Invalid token" });
    }
  } else {
    user = {
      username: "Guest",
      email: "",
      role: "participant",
      moderator: false,
    };
  }

  const jitsiToken = generateJitsiToken(user);
  res.json({ token: jitsiToken });
});

/**
 * POST /auth/token:  { username, password } => { token }
 * Returns JWT token which can be used to authenticate further requests.
 * Authorization required: none
 */
router.post(
  "/token",
  validateSchema(userAuthSchema),
  async (req, res, next) => {
    try {
      const { username, password } = req.body;
      const user = await User.authenticate(username, password);
      const token = createToken(user);
      console.log(`${user.username} assigned token`.green);
      return res.json({ token });
    } catch (err) {
      next(err);
    }
  }
);

/**
 * POST /auth/livekit-token
 * Generates an access token for LiveKit.
 * Expects { roomName: string, identity: string (optional), name: string (optional) } in body.
 * If identity is not provided, it might try to use authenticated user's info or a guest identity.
 * Authorization: Should ideally be protected or ensure identity is handled securely.
 * For now, let's keep it simple and allow generating tokens for given identities.
 */
router.post("/livekit-token", async (req, res, next) => {
  try {
    const { roomName, identity, name, isModerator } = req.body;

    if (!roomName) {
      return res.status(400).json({ error: "roomName is required" });
    }

    // Determine user identity and name
    // For simplicity, we'll use provided identity/name or fallback to a guest if none.
    // In a real app, you'd likely use the authenticated user's details (req.user from auth middleware).
    const userInfo = {
      identity: identity || req.user?.username || `guest-${Math.random().toString(36).substr(2, 5)}`,
      name: name || req.user?.firstName || "Guest User",
      // You might want to pass more user metadata if needed by LiveKit participant
    };

    // Check if user is a moderator (example logic, adapt as needed)
    // This could come from req.user.isAdmin or based on room ownership etc.
    const moderatorStatus = isModerator || req.user?.isAdmin || false;

    const liveKitToken = generateLiveKitToken(userInfo, roomName, moderatorStatus);
    return res.json({ token: liveKitToken });
  } catch (err) {
    console.error("Error generating LiveKit token:", err);
    next(err);
  }
});

export default router;
