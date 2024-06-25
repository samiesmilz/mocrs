"use strict";
/** Database setup for mocrs. */

import pg from "pg";

const Client = pg.Client;
import { getDatabaseUri } from "./config.js";

let db;

if (process.env.NODE_ENV === "production") {
  db = new Client({
    connectionString: getDatabaseUri(),
    ssl: {
      rejectUnauthorized: false,
    },
  });
} else {
  db = new Client({
    connectionString: getDatabaseUri(),
  });
}

db.connect();

export default db;
