"use strict";

/** Routes for users. */

import jsonschema from "jsonschema";
import express from "express";
import { ensureCorrectUserOrAdmin, ensureAdmin } from "../middleware/auth.js";
import { BadRequestError } from "../middleware/expressError.js";
import User from "../models/user.js";
import { createToken } from "../helpers/tokens.js";
import userNewSchema from "../schemas/userNew.js";
import userUpdateSchema from "../schemas/userUpdate.js";

const router = express.Router();

/**
 * POST / { user }  => { user, token }
 * Adds a new user. This is not the registration endpoint --- instead, this is
 * only for admin users to add new users. The new user added can be an admin.
 * This returns the newly created user and an authentication token for them:
 *  {user: { username, firstName, lastName, email, isAdmin }, token }
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
 * GET / => { users: [ {username, firstName, lastName, email }, ... ] }
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
 * GET /[username] => { user }
 * Returns { username, firstName, lastName, isAdmin, rooms }
 *   where rooms is { id, uuid, name, description, room_type, is_private, creator_id,created_at,participants } * Authorization required: admin or same user-as-:username
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
 * ATCH /[username] { user } => { user }
 * Data can include:
 *   { firstName, lastName, password, email }
 * Returns { username, firstName, lastName, email, isAdmin }
 * Authorization required: admin or same-user-as-:username
 */
router.patch("/:username", ensureCorrectUserOrAdmin, async (req, res, next) => {
  try {
    const validator = jsonschema.validate(req.body, userUpdateSchema);
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
 * DELETE /[username]  =>  { deleted: username }
 * Authorization required: admin or same-user-as-:username
 */
router.delete(
  "/:username",
  ensureCorrectUserOrAdmin,
  async (req, res, next) => {
    try {
      await User.remove(req.params.username);
      return res.json({ deleted: req.params.username });
    } catch (err) {
      return next(err);
    }
  }
);

export default router;
