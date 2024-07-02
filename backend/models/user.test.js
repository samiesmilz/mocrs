import User from "../models/user";
import bcrypt from "bcrypt";
import db from "../db";

const BCRYPT_WORK_FACTOR = 1;

async function commonBeforeAll() {
  // Clear the users table
  await db.query("DELETE FROM users");

  // Insert test users
  await db.query(
    `
    INSERT INTO users(username,
                      password,
                      first_name,
                      last_name,
                      email)
    VALUES ('u1', $1, 'U1F', 'U1L', 'u1@email.com'),
           ('u2', $2, 'U2F', 'U2L', 'u2@email.com')
    RETURNING username`,
    [
      await bcrypt.hash("password1", BCRYPT_WORK_FACTOR),
      await bcrypt.hash("password2", BCRYPT_WORK_FACTOR),
    ]
  );
}

async function commonBeforeEach() {
  await db.query("BEGIN");
}

async function commonAfterEach() {
  await db.query("ROLLBACK");
}

async function commonAfterAll() {
  await db.end();
}

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

describe("User.update", () => {
  test("updates a user's first name", async () => {
    const user = await User.register({
      username: "testuser1",
      firstName: "Test",
      lastName: "User",
      email: "test1@example.com",
      password: "password",
      isAdmin: false,
    });

    const updatedUser = await User.update(user.username, {
      firstName: "UpdatedTest",
    });

    expect(updatedUser).toEqual({
      ...user,
      firstName: "UpdatedTest",
    });
  });

  test("updates a user's last name", async () => {
    const user = await User.register({
      username: "testuser2",
      firstName: "Test",
      lastName: "User",
      email: "test2@example.com",
      password: "password",
      isAdmin: false,
    });

    const updatedUser = await User.update(user.username, {
      lastName: "UpdatedUser",
    });

    expect(updatedUser).toEqual({
      ...user,
      lastName: "UpdatedUser",
    });
  });

  test("updates a user's admin status", async () => {
    const user = await User.register({
      username: "testuser3",
      firstName: "Test",
      lastName: "User",
      email: "test3@example.com",
      password: "password",
      isAdmin: false,
    });

    const updatedUser = await User.update(user.username, { isAdmin: true });

    expect(updatedUser).toEqual({
      ...user,
      isAdmin: true,
    });
  });

  test("updates a user's password", async () => {
    const user = await User.register({
      username: "testuser4",
      firstName: "Test",
      lastName: "User",
      email: "test4@example.com",
      password: "password",
      isAdmin: false,
    });

    const updatedUser = await User.update(user.username, {
      password: "newpassword",
    });

    // Verify that the password is not returned in the response
    expect(updatedUser).not.toHaveProperty("password");

    // Verify that the password is updated correctly
    const authenticatedUser = await User.authenticate(
      user.username,
      "newpassword"
    );
    expect(authenticatedUser).toBeTruthy();
  });

  test("updates a user's email", async () => {
    const user = await User.register({
      username: "testuser5",
      firstName: "Test",
      lastName: "User",
      email: "test5@example.com",
      password: "password",
      isAdmin: false,
    });

    const updatedUser = await User.update(user.username, {
      email: "updated5@example.com",
    });

    expect(updatedUser).toEqual({
      ...user,
      email: "updated5@example.com",
    });
  });
});
