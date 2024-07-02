"use strict";

import jwt from "jsonwebtoken";
import { SECRET_KEY } from "../config.js";
import { UnauthorizedError } from "./expressError.js";
import "colors";

/**
 * Middleware: Authenticate user via JWT.
 * If a valid token is provided in the Authorization header,
 * decode it and attach the user information to req.user.
 * If token is missing or invalid, respond with 401 Unauthorized.
 */

const authenticateJWT = (req, res, next) => {
  try {
    console.log("Authenticating...".green);
    const authHeader = req.headers.authorization;
    console.log("Authheader: ", authHeader);

    if (authHeader) {
      const regex = /Bearer\s+([^"]+)/;
      const match = authHeader.match(regex);
      if (match && match[1]) {
        const token = match[1];
        console.log(`Extracted token: ${token}`);
        console.log(`Received token: ${token}`.pink);
        const decoded = jwt.verify(token, SECRET_KEY);
        console.log(`Decoded token:`, decoded);
        req.user = decoded;
        console.log(`Authorized user:`, req.user);
      } else {
        console.log("Token not found");
      }
    } else {
      console.log("No token provided or invalid format.".yellow);
      req.user = undefined; // Explicitly set to null when no token
    }
  } catch (error) {
    console.error("JWT verification failed:".red, error.message);
    req.user = undefined; // Set to null on error
  } finally {
    next(); // Always proceed to next middleware
  }
};

/**
 * Middleware: Ensure user is logged in.
 * Throws an UnauthorizedError if no user is found on req.user.
 */
const ensureLoggedIn = (req, res, next) => {
  try {
    if (!req.user) {
      throw new UnauthorizedError("Unauthorized - you must be logged in.");
    }
    next();
  } catch (err) {
    next(err);
  }
};

/**
 * Middleware: Ensure user is an admin.
 * Throws an UnauthorizedError if the user on req.user is not an admin.
 */
const ensureAdmin = (req, res, next) => {
  try {
    if (!req.user || !req.user.isAdmin) {
      throw new UnauthorizedError("Unauthorized - you must be an admin.");
    }
    next();
  } catch (err) {
    next(err);
  }
};

/**
 * Middleware: Ensure user has a valid token and matches the username in the route parameter.
 * Throws an UnauthorizedError if the user on req.user is missing, lacks admin privileges, or doesn't match the username.
 */
const ensureCorrectUserOrAdmin = (req, res, next) => {
  try {
    console.log("Checking user in ensure user or admin...".blue);
    if (
      req.user &&
      (req.user.isAdmin || req.user.username === req.params.username)
    ) {
      return next();
    } else {
      throw new UnauthorizedError(
        "Unauthorized - must be the account owner or the admin"
      );
    }
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
