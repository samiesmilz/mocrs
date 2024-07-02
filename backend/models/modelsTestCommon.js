"use strict";

import db from "../db";
import User from "./user";
import Room from "./room";
import { createToken } from "../helpers/tokens";

async function commonBeforeAll() {
  await db.query("DELETE FROM users");
  await db.query("DELETE FROM rooms");

  await User.register({
    username: "u1",
    firstName: "U1F",
    lastName: "U1L",
    email: "user1@user.com",
    password: "password1",
    isAdmin: false,
  });
  await User.register({
    username: "u2",
    firstName: "U2F",
    lastName: "U2L",
    email: "user2@user.com",
    password: "password2",
    isAdmin: false,
  });
  await User.register({
    username: "u3",
    firstName: "U3F",
    lastName: "U3L",
    email: "user3@user.com",
    password: "password3",
    isAdmin: false,
  });

  await Room.create({
    name: "Room 1",
    description: "Room 1 description",
    type: "study",
    is_private: false,
    creator_id: 1,
  });

  await Room.create({
    name: "Room 2",
    description: "Room 2 description",
    type: "chat",
    is_private: false,
    creator_id: 2,
  });

  await Room.create({
    name: "Room 3",
    description: "Room 3 description",
    type: "meeting",
    is_private: false,
    creator_id: 3,
  });
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

const u1Token = createToken({ username: "u1", isAdmin: false });
const u2Token = createToken({ username: "u2", isAdmin: false });
const adminToken = createToken({ username: "admin", isAdmin: true });

module.exports = {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  u1Token,
  u2Token,
  adminToken,
};
