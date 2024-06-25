/**
 * Controller for managing rooms.
 * @module controllers/roomController
 */

"use strict";

import db from "../db.js";
import jsonschema from "jsonschema";
import { BadRequestError } from "../middleware/expressError.js";
import newRoomSchema from "../schemas/newRoomSchema.js";

/**
 * Get all rooms.
 * Responds with a JSON array containing all rooms.
 */
export const getRooms = async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM rooms");
    return res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * Create a new room.
 * Expects a JSON object containing name, description, room_type, and is_private in the request body.
 * Responds with a JSON object representing the newly created room (including a status code of 201 - Created).
 */
export const createRoom = async (req, res) => {
  const validator = jsonschema.validate(req.body, newRoomSchema);
  if (!validator.valid) {
    const errs = validator.errors.map((e) => e.stack);
    throw new BadRequestError(errs);
  }
  const { name, description, room_type, is_private, creator_id } = req.body;
  try {
    const result = await db.query(
      "INSERT INTO rooms (name, description, room_type, is_private, creator_id) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [name, description, room_type, is_private, creator_id]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * Get a specific room by its UUID.
 * Responds with a JSON object representing the room or a 404 Not Found error message if the room is not found.
 */
export const getRoom = async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM rooms WHERE uuid = $1", [
      req.params.id,
    ]);
    if (result.rows.length > 0) {
      res.json(result.rows[0]);
    } else {
      res.status(404).json({ message: "Room not found" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * Join a room by its UUID.
 * Increments the room's participant count and responds with the room details.
 * Responds with a 404 Not Found error message if the room is not found.
 */
export const joinRoom = async (req, res) => {
  try {
    const result = await db.query(
      "UPDATE rooms SET participants = participants + 1 WHERE uuid = $1 RETURNING *",
      [req.params.uuid]
    );
    if (result.rows.length > 0) {
      res.json(result.rows[0]);
    } else {
      res.status(404).json({ message: "Room not found" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * Leave a room by its UUID.
 * Decrements the room's participant count if there are participants, otherwise responds with an error.
 * Responds with a 204 No Content status code on successful leave.
 * Responds with a 404 Not Found error message if the room is not found or there are no participants.
 */
export const leaveRoom = async (req, res) => {
  try {
    const result = await db.query(
      "UPDATE rooms SET participants = participants - 1 WHERE uuid = $1 AND participants > 0 RETURNING *",
      [req.params.uuid]
    );
    if (result.rows.length > 0) {
      res.status(204).end();
    } else {
      res.status(404).json({ message: "Room not found or no participants" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};
