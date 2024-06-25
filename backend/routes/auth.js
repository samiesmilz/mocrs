"use strict";

import express from "express";
import jsonschema from "jsonschema";
import jwt from "jsonwebtoken";
import User from "../models/user.js";
import userAuthSchema from "../schemas/userAuth.js";
import userRegisterSchema from "../schemas/userRegister.js";
import { BadRequestError } from "../middleware/expressError.js";
import { SECRET_KEY } from "../config.js";
import colors from "colors";

import { createToken, generateJitsiToken } from "../helpers/tokens.js";

const router = express.Router();

/**
 * POST /auth/token:  { username, password } => { token }
 * Returns JWT token which can be used to authenticate further requests.
 * Authorization required: none
 */

router.post("/token", async (req, res, next) => {
  try {
    const { error } = jsonschema.validate(req.body, userAuthSchema); // Destructure validation error
    if (error) {
      throw new BadRequestError(error.details.map((e) => e.message)); // Format validation errors
    }
    const { username, password } = req.body;
    const user = await User.authenticate(username, password);
    const token = createToken(user);
    return res.json({ token });
  } catch (err) {
    next(err);
  }
});

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
  const token = user.token;
  if (token) console.log("Token received.".yellow);

  if (token) {
    try {
      const decoded = jwt.verify(token, SECRET_KEY);
      console.log("Token verified.".green);
    } catch (tokenError) {
      console.error("Token verification failed:", tokenError);
      return res.status(401).json({ error: "Invalid token" });
    }
  } else {
    // If no token is provided or token is null, proceed as a guest
    console.log("No token provided - Proceeding as guest.");
    user = { username: "Guest", email: "", role: "participant" };
  }

  const jitsiToken = generateJitsiToken(user);
  res.json({ token: jitsiToken });
});

export default router;
