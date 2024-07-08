"use strict";

import express from "express";
import jwt from "jsonwebtoken";
import User from "../models/user.js";
import userAuthSchema from "../schemas/userAuth.js";
import userRegisterSchema from "../schemas/userRegister.js";
import { SECRET_KEY } from "../config.js";
import { generateJitsiToken } from "../helpers/tokens.js";
import { createToken } from "../helpers/tokens.js";
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

export default router;
