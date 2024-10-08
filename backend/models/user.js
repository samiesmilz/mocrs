"use strict";

import db from "../db.js";
import bcrypt from "bcrypt";
import { sqlForPartialUpdate } from "../helpers/sql.js";
import {
  NotFoundError,
  BadRequestError,
  UnauthorizedError,
} from "../middleware/expressError.js";
import { BCRYPT_WORK_FACTOR } from "../config.js";

/** Related functions for users. */

class User {
  /**
   * Authenticate user with username, password.
   * Returns { id, username, firstName, lastName, email, isAdmin }
   * Throws UnauthorizedError if user not found or wrong password.
   **/
  static async authenticate(username, password) {
    // try to find the user first
    const result = await db.query(
      `SELECT id,
                username,
                password,
                first_name AS "firstName",
                last_name AS "lastName",
                email,
                is_admin AS "isAdmin"
           FROM users
           WHERE username = $1`,
      [username]
    );

    const user = result.rows[0];

    if (user) {
      // compare hashed password to a new hash from password
      const isValid = await bcrypt.compare(password, user.password);
      if (isValid === true) {
        delete user.password;
        return user;
      }
    }
    throw new UnauthorizedError("Invalid username/password");
  }

  /**
   * Register user with data.
   * Returns { id, username, firstName, lastName, email, isAdmin }
   * Throws BadRequestError on duplicates.
   **/
  static async register({
    username,
    password,
    firstName,
    lastName,
    email,
    isAdmin,
  }) {
    const duplicateCheck = await db.query(
      `SELECT username
           FROM users
           WHERE username = $1`,
      [username]
    );

    if (duplicateCheck.rows[0]) {
      throw new BadRequestError(`Duplicate username: ${username}`);
    }

    // hash the password
    const hashedPassword = await bcrypt.hash(password, BCRYPT_WORK_FACTOR);

    const result = await db.query(
      `INSERT INTO users
           (username,
            password,
            first_name,
            last_name,
            email,
            is_admin)
           VALUES ($1, $2, $3, $4, $5, $6)
           RETURNING id, username, first_name AS "firstName", last_name AS "lastName", email, is_admin AS "isAdmin"`,
      [username, hashedPassword, firstName, lastName, email, isAdmin]
    );

    const user = result.rows[0];

    return user;
  }

  /**
   * Find all users.
   * Returns [{ id, username, firstName, lastName, email, isAdmin }, ...]
   **/
  static async findAll() {
    const result = await db.query(
      `SELECT id,
                username,
                first_name AS "firstName",
                last_name AS "lastName",
                email,
                is_admin AS "isAdmin"
           FROM users
           ORDER BY username`
    );

    return result.rows;
  }

  /**
   * Given a username, return data about user.
   * Returns { id, username, firstName, lastName, email, isAdmin, rooms }
   *   where rooms is [{ id, uuid, name, description, room_type, is_private, creator_id, participants }, ...]
   * Throws NotFoundError if user not found.
   **/
  static async get(username) {
    const userRes = await db.query(
      `SELECT id,
                  username,
                  first_name AS "firstName",
                  last_name AS "lastName",
                  email,
                  is_admin AS "isAdmin"
           FROM users
           WHERE username = $1`,
      [username]
    );

    const user = userRes.rows[0];

    if (!user) throw new NotFoundError(`No user: ${username}`);

    const userRoomsRes = await db.query(
      `SELECT id, uuid, name, description, room_type AS "roomType", is_private AS "isPrivate", creator_id AS "creatorId", participants
           FROM rooms
           WHERE creator_id = $1`,
      [user.id]
    );

    user.rooms = userRoomsRes.rows;

    return user;
  }

  /** Update user data with `data`.
   *
   * This is a "partial update" --- it's fine if data doesn't contain
   * all the fields; this only changes provided ones.
   *
   * Data can include:
   *   { firstName, lastName, password, email, isAdmin }
   * Returns { id, username, firstName, lastName, email, isAdmin }
   * Throws NotFoundError if not found.
   *
   * WARNING: this function can set a new password or make a user an admin.
   * Callers of this function must be certain they have validated inputs to this
   * or a serious security risk is opened.
   */
  static async update(username, data) {
    if (data.password) {
      data.password = await bcrypt.hash(data.password, BCRYPT_WORK_FACTOR);
    }

    const { setCols, values } = sqlForPartialUpdate(data, {
      firstName: "first_name",
      lastName: "last_name",
      isAdmin: "is_admin",
    });

    const usernameVarIdx = "$" + (values.length + 1);

    const querySql = `UPDATE users 
                      SET ${setCols} 
                      WHERE username = ${usernameVarIdx} 
                      RETURNING id,
                                username,
                                first_name AS "firstName",
                                last_name AS "lastName",
                                email,
                                is_admin AS "isAdmin"`;

    const result = await db.query(querySql, [...values, username]);
    const user = result.rows[0];

    if (!user) throw new NotFoundError(`No user: ${username}`);

    delete user.password;
    return user;
  }

  /** Delete given user from database; returns username. */
  static async remove(username) {
    const result = await db.query(
      `DELETE
           FROM users
           WHERE username = $1
           RETURNING username`,
      [username]
    );

    const user = result.rows[0];
    if (!user) throw new NotFoundError(`No user: ${username}`);
  }
}

export default User;
