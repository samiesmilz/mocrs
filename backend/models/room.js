import db from "../db.js";
import { NotFoundError } from "../middleware/expressError.js";

class Room {
  /**
   * Get all rooms.
   * @returns {Promise<Array>} List of all rooms.
   */
  static async findAll() {
    const result = await db.query("SELECT * FROM rooms");
    return result.rows;
  }

  /**
   * Create a new room.
   * @param {Object} roomData - Data for the new room.
   * @returns {Promise<Object>} The newly created room.
   */
  static async create({
    name,
    description,
    room_type,
    is_private,
    creator_id,
  }) {
    const result = await db.query(
      "INSERT INTO rooms (name, description, room_type, is_private, creator_id) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [name, description, room_type, is_private, creator_id]
    );
    return result.rows[0];
  }

  /**
   * Get a room by its UUID.
   * @param {string} uuid - UUID of the room.
   * @returns {Promise<Object>} The room.
   * @throws {NotFoundError} If no room found with the given UUID.
   */
  static async get(uuid) {
    const result = await db.query("SELECT * FROM rooms WHERE uuid = $1", [
      uuid,
    ]);
    if (result.rows.length === 0) {
      throw new NotFoundError(`No room: ${uuid}`);
    }
    return result.rows[0];
  }

  /**
   * Increment the participant count of a room.
   * @param {string} uuid - UUID of the room.
   * @returns {Promise<Object>} The updated room.
   * @throws {NotFoundError} If no room found with the given UUID.
   */
  static async join(uuid) {
    const result = await db.query(
      "UPDATE rooms SET participants = participants + 1 WHERE uuid = $1 RETURNING *",
      [uuid]
    );
    if (result.rows.length === 0) {
      throw new NotFoundError(`No room: ${uuid}`);
    }
    return result.rows[0];
  }

  /**
   * Decrement the participant count of a room.
   * @param {string} uuid - UUID of the room.
   * @returns {Promise<void>}
   * @throws {NotFoundError} If no room found with the given UUID or no participants to leave.
   */
  static async leave(uuid) {
    const result = await db.query(
      "UPDATE rooms SET participants = participants - 1 WHERE uuid = $1 AND participants > 0 RETURNING *",
      [uuid]
    );
    if (result.rows.length === 0) {
      throw new NotFoundError(`No room: ${uuid} or no participants to leave`);
    }
    return result.rows[0]; // Return the updated room object
  }

  /**
   * Get all public rooms.
   * @returns {Promise<Array>} List of all public rooms.
   */
  static async findPublic() {
    const result = await db.query(
      "SELECT * FROM rooms WHERE is_private = false"
    );
    return result.rows;
  }

  /**
   * Get all private rooms.
   * @returns {Promise<Array>} List of all private rooms.
   */
  static async findPrivate() {
    const result = await db.query(
      "SELECT * FROM rooms WHERE is_private = true"
    );
    return result.rows;
  }

  /**
   * Get all rooms by a specific creator.
   * @param {number} creatorId - ID of the creator.
   * @returns {Promise<Array>} List of rooms created by the specified user.
   */
  static async findByCreator(creatorId) {
    const result = await db.query("SELECT * FROM rooms WHERE creator_id = $1", [
      creatorId,
    ]);
    return result.rows;
  }

  /**
   * Get all private rooms by a specific user.
   * @param {number} creatorId - ID of the creator.
   * @returns {Promise<Array>} List of private rooms created by the specified user.
   */
  static async findPrivateByUser(creatorId) {
    const result = await db.query(
      "SELECT * FROM rooms WHERE creator_id = $1 AND is_private = true",
      [creatorId]
    );
    return result.rows;
  }

  /**
   * Update room details.
   * @param {string} uuid - UUID of the room.
   * @param {Object} data - Updated room data.
   * @returns {Promise<Object>} The updated room.
   * @throws {NotFoundError} If no room found with the given UUID.
   */
  static async update(uuid, data) {
    const { name, description, room_type, is_private } = data;
    const result = await db.query(
      `UPDATE rooms
       SET name = $1,
           description = $2,
           room_type = $3,
           is_private = $4
       WHERE uuid = $5
       RETURNING *`,
      [name, description, room_type, is_private, uuid]
    );
    if (result.rows.length === 0) {
      throw new NotFoundError(`No room: ${uuid}`);
    }
    return result.rows[0];
  }

  /**
   * Delete a room.
   * @param {string} uuid - UUID of the room.
   * @returns {Promise<void>}
   * @throws {NotFoundError} If no room found with the given UUID.
   */
  static async remove(uuid) {
    const result = await db.query(
      "DELETE FROM rooms WHERE uuid = $1 RETURNING *",
      [uuid]
    );
    if (result.rows.length === 0) {
      throw new NotFoundError(`No room: ${uuid}`);
    }
  }
}

export default Room;
