"use strict";

import jwt from "jsonwebtoken";
import { SECRET_KEY } from "../config.js";
import { UnauthorizedError } from "./expressError.js";

/**
 * Middleware: Authenticate user.
 * If a token is provided, verify it and store the decoded payload
 * (including username and isAdmin) on res.locals.
 * Doesn't throw an error if no token is provided or if the token is invalid.
 */
const authenticateJWT = (req, res, next) => {
  try {
    const authHeader = req.headers?.authorization;
    if (authHeader) {
      const token = authHeader.replace(/^[Bb]earer /, "").trim();
      res.locals.user = jwt.verify(token, SECRET_KEY);
    }
    next();
  } catch (err) {
    next();
  }
};

/**
 * Middleware: Ensure user is logged in.
 * Throws an UnauthorizedError if no user is found on res.locals (indicating no valid token).
 */
const ensureLoggedIn = (req, res, next) => {
  try {
    if (!res.locals.user) {
      throw new UnauthorizedError();
    }
    next();
  } catch (err) {
    next(err);
  }
};

/**
 * Middleware: Ensure user is an admin.
 * Throws an UnauthorizedError if the user on res.locals is not present or lacks the "isAdmin" property.
 */
const ensureAdmin = (req, res, next) => {
  try {
    if (!res.locals.user || !res.locals.user.isAdmin) {
      throw new UnauthorizedError();
    }
    next();
  } catch (err) {
    next(err);
  }
};

/**
 * Middleware: Ensure user has a valid token and matches the username in the route parameter.
 * Throws an UnauthorizedError if the user on res.locals is missing, lacks admin privileges, or doesn't match the username.
 */
const ensureCorrectUserOrAdmin = (req, res, next) => {
  try {
    const user = res.locals.user;
    if (!(user && (user.isAdmin || user.username === req.params.username))) {
      throw new UnauthorizedError();
    }
    next();
  } catch (err) {
    next(err);
  }
};

export {
  authenticateJWT,
  ensureLoggedIn,
  ensureAdmin,
  ensureCorrectUserOrAdmin,
};
