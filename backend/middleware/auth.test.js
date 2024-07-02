"use strict";

import jwt from "jsonwebtoken";
import {
  authenticateJWT,
  ensureLoggedIn,
  ensureAdmin,
  ensureCorrectUserOrAdmin,
} from "./auth.js";
import { UnauthorizedError } from "./expressError.js";
import { SECRET_KEY } from "../config.js";

// Mock functions and setup
jest.mock("./expressError.js", () => ({
  UnauthorizedError: jest.fn(),
}));

const testJwt = jwt.sign({ username: "test", isAdmin: false }, SECRET_KEY);
const badJwt = jwt.sign({ username: "test", isAdmin: false }, "wrong");

describe("authenticateJWT", () => {
  let req, res, next;

  beforeEach(() => {
    req = { headers: {}, user: undefined };
    res = {};
    next = jest.fn();
  });

  test("works: via header", () => {
    req.headers.authorization = `Bearer ${testJwt}`;
    authenticateJWT(req, res, next);
    expect(req.user).toEqual({
      username: "test",
      isAdmin: false,
      iat: expect.any(Number), // iat should be present
    });
    expect(next).toHaveBeenCalled();
  });

  test("works: no header", () => {
    authenticateJWT(req, res, next);
    expect(req.user).toBeUndefined();
    expect(next).toHaveBeenCalled();
  });

  test("fails: invalid token", () => {
    req.headers.authorization = `Bearer ${badJwt}`;
    authenticateJWT(req, res, next);
    expect(req.user).toBeUndefined();
    expect(next).toHaveBeenCalled();
  });
});

describe("ensureLoggedIn", () => {
  let req, res, next;

  beforeEach(() => {
    req = { user: undefined };
    res = {};
    next = jest.fn();
  });

  test("works", () => {
    req.user = { username: "test", isAdmin: false };
    ensureLoggedIn(req, res, next);
    expect(next).toHaveBeenCalled();
  });

  test("unauth if no login", () => {
    ensureLoggedIn(req, res, next);
    expect(next).toHaveBeenCalledWith(expect.any(UnauthorizedError));
  });
});

describe("ensureAdmin", () => {
  let req, res, next;

  beforeEach(() => {
    req = { user: undefined };
    res = {};
    next = jest.fn();
  });

  test("works", () => {
    req.user = { username: "test", isAdmin: true };
    ensureAdmin(req, res, next);
    expect(next).toHaveBeenCalled();
  });

  test("unauth if not admin", () => {
    req.user = { username: "test", isAdmin: false };
    ensureAdmin(req, res, next);
    expect(next).toHaveBeenCalledWith(expect.any(UnauthorizedError));
  });

  test("unauth if anon", () => {
    ensureAdmin(req, res, next);
    expect(next).toHaveBeenCalledWith(expect.any(UnauthorizedError));
  });
});

describe("ensureCorrectUserOrAdmin", () => {
  let req, res, next;

  beforeEach(() => {
    req = { params: {}, user: undefined };
    res = {};
    next = jest.fn();
  });

  test("works: admin", () => {
    req.params.username = "test";
    req.user = { username: "admin", isAdmin: true };
    ensureCorrectUserOrAdmin(req, res, next);
    expect(next).toHaveBeenCalled();
  });

  test("works: same user", () => {
    req.params.username = "test";
    req.user = { username: "test", isAdmin: false };
    ensureCorrectUserOrAdmin(req, res, next);
    expect(next).toHaveBeenCalled();
  });

  test("unauth: mismatch", () => {
    req.params.username = "wrong";
    req.user = { username: "test", isAdmin: false };
    ensureCorrectUserOrAdmin(req, res, next);
    expect(next).toHaveBeenCalledWith(expect.any(UnauthorizedError));
  });

  test("unauth: if anon", () => {
    req.params.username = "test";
    ensureCorrectUserOrAdmin(req, res, next);
    expect(next).toHaveBeenCalledWith(expect.any(UnauthorizedError));
  });
});
