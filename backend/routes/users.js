"use strict";

/** Routes for users. */

import jsonschema from "jsonschema";
import express from "express";
import {
  ensureCorrectUserOrAdmin,
  authenticateJWT,
  ensureAdmin,
} from "../middleware/auth.js";
import { BadRequestError } from "../middleware/expressError.js";
import User from "../models/user.js"; // Importing User model directly
import { createToken } from "../helpers/tokens.js";
import userNewSchema from "../schemas/userNew.js";
import userUpdateSchema from "../schemas/userUpdate.js";

const router = express.Router();
router.use(authenticateJWT);
/**
 * POST /users
 * Adds a new user. This endpoint is for admin users to add new users.
 * Returns the newly created user and an authentication token for them:
 * { user: { username, firstName, lastName, email, isAdmin }, token }
 * Authorization required: admin
 */
router.post("/", ensureAdmin, async (req, res, next) => {
  try {
    const validator = jsonschema.validate(req.body, userNewSchema);
    if (!validator.valid) {
      const errs = validator.errors.map((e) => e.stack);
      throw new BadRequestError(errs);
    }
    const user = await User.register(req.body);
    const token = createToken(user);
    return res.status(201).json({ user, token });
  } catch (err) {
    return next(err);
  }
});

/**
 * GET /users
 * Returns list of all users.
 * Authorization required: admin
 */
router.get("/", ensureAdmin, async (req, res, next) => {
  try {
    const users = await User.findAll();
    return res.json({ users });
  } catch (err) {
    return next(err);
  }
});

/**
 * GET /users/:username
 * Returns detailed information about a specific user.
 * Authorization required: admin or same user-as-:username
 */
router.get("/:username", ensureCorrectUserOrAdmin, async (req, res, next) => {
  try {
    const user = await User.get(req.params.username);
    return res.json({ user });
  } catch (err) {
    return next(err);
  }
});

/**
 * PATCH /users/:username
 * Updates user information.
 * Data can include:
 * { firstName, lastName, password, email }
 * Returns updated user information.
 * Authorization required: admin or same-user-as-:username
 */
router.patch("/:username", ensureCorrectUserOrAdmin, async (req, res, next) => {
  try {
    const validator = jsonschema.validate(req.body, userUpdateSchema);
    console.log(`User in patch: ${req.body}`);
    console.log(`Validator returned: ${validator.valid}`);
    if (!validator.valid) {
      const errs = validator.errors.map((e) => e.stack);
      throw new BadRequestError(errs);
    }
    const user = await User.update(req.params.username, req.body);
    return res.json({ user });
  } catch (err) {
    return next(err);
  }
});

/**
 * DELETE /users/:username
 * Deletes a user.
 * Authorization required: admin or same-user-as-:username
 */
router.delete(
  "/:username",
  ensureCorrectUserOrAdmin,
  async (req, res, next) => {
    try {
      console.log(`Request to delete: ${req.params.username}`);
      await User.remove(req.params.username);
      return res.json({ deleted: req.params.username });
    } catch (err) {
      return next(err);
    }
  }
);

export default router;
