import jwt from "jsonwebtoken";
import { SECRET_KEY } from "../config.js";
import { createToken } from "./tokens.js";

describe("createToken", function () {
  test("creates token with isAdmin true", function () {
    const token = createToken({ username: "test", isAdmin: true });
    const payload = jwt.verify(token, SECRET_KEY);
    expect(payload).toEqual({
      iat: expect.any(Number),
      username: "test",
      isAdmin: true,
    });
  });

  test("creates token with isAdmin false (default)", function () {
    const token = createToken({ username: "test" }); // No isAdmin property
    const payload = jwt.verify(token, SECRET_KEY);
    expect(payload).toEqual({
      iat: expect.any(Number),
      username: "test",
      isAdmin: false, // Defaults to false when isAdmin is not provided
    });
  });

  test("creates token with isAdmin false (explicit)", function () {
    const token = createToken({ username: "test", isAdmin: false });
    const payload = jwt.verify(token, SECRET_KEY);
    expect(payload).toEqual({
      iat: expect.any(Number),
      username: "test",
      isAdmin: false,
    });
  });
});
