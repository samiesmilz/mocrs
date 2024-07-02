"use strict";

import express from "express";
import jsonschema from "jsonschema";
import jwt from "jsonwebtoken";
import User from "../models/user.js";
import userAuthSchema from "../schemas/userAuth.js";
import userRegisterSchema from "../schemas/userRegister.js";
import { BadRequestError } from "../middleware/expressError.js";
import { SECRET_KEY } from "../config.js";
import { generateJitsiToken } from "../helpers/tokens.js";
import { createToken } from "../helpers/tokens.js";
import "colors";
const router = express.Router();

/**
 * POST /auth/login:  { username, password } => { token }
 * Returns JWT token which can be used to authenticate further requests.
 * Authorization required: none
 */

router.post("/login", async (req, res, next) => {
  try {
    const { error } = jsonschema.validate(req.body, userAuthSchema); //  validation error
    if (error) {
      throw new BadRequestError(error.details.map((e) => e.message)); // Format validation errors
    }
    const { username, password } = req.body;
    const user = await User.authenticate(username, password);
    const token = createToken(user);
    return res.json({ user, token });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /auth/register:   { user } => { token }
 * user must include { username, password, firstName, lastName, email }
 * Returns JWT token which can be used to authenticate further requests.
 * Authorization required: none
 */

router.post("/register", async (req, res, next) => {
  try {
    const { error } = jsonschema.validate(req.body, userRegisterSchema);
    if (error) {
      throw new BadRequestError(error.details.map((e) => e.message));
    }
    const newUser = await User.register({ ...req.body, isAdmin: false });
    const token = createToken(newUser);
    return res.status(201).json({ newUser, token });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /auth/jtoken
 * Generates a JWT token for Jitsi integration based on user authentication token.
 * Expects { token } in headers or body and { username, email } in body.
 * Returns { token } upon successful authentication.
 * Authorization required: none explicitly, but handled implicitly via token.
 */

router.post("/jtoken", (req, res) => {
  // The user is now available in req.user
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
    // If no token is provided or token is null

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

router.post("/token", async (req, res, next) => {
  try {
    const { error } = jsonschema.validate(req.body, userAuthSchema);
    if (error) {
      throw new BadRequestError(error.details.map((e) => e.message));
    }
    const { username, password } = req.body;
    const user = await User.authenticate(username, password);
    const token = createToken(user);
    console.log(`${user.username} assigned token`.green);
    return res.json({ token });
  } catch (err) {
    next(err);
  }
});

export default router;
