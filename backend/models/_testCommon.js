import bcrypt from "bcrypt";
import db from "../db.js";
import { BCRYPT_WORK_FACTOR } from "../config.js";

/**
 * Function to run before all tests.
 * Clears the users table and inserts test users.
 */
async function commonBeforeAll() {
  // noinspection SqlWithoutWhere
  await db.query("DELETE FROM users");

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

/**
 * Function to run before each test.
 * Starts a new transaction.
 */
async function commonBeforeEach() {
  await db.query("BEGIN");
}

/**
 * Function to run after each test.
 * Rolls back the transaction.
 */
async function commonAfterEach() {
  await db.query("ROLLBACK");
}

/**
 * Function to run after all tests.
 * Ends the database connection.
 */
async function commonAfterAll() {
  await db.end();
}

export { commonBeforeAll, commonBeforeEach, commonAfterEach, commonAfterAll };
