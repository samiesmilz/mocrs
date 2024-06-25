import db from "../db.js";

class Room {
  constructor(data) {
    this.id = data.id;
    this.uuid = data.uuid;
    this.name = data.name;
    this.description = data.description;
    this.room_type = data.room_type;
    this.is_private = data.is_private;
    this.creator_id = data.creator_id;
    this.created_at = data.created_at;
    this.participants = data.participants || 0;
  }

  static async create(data) {
    const { name, description, room_type, is_private, creator_id } = data;
    const result = await db.query(
      "INSERT INTO rooms (name, description, room_type, is_private, creator_id) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [name, description, room_type, is_private, creator_id]
    );
    return new Room(result.rows[0]);
  }

  static async findById(id) {
    const result = await db.query("SELECT * FROM rooms WHERE id = $1", [id]);
    return result.rows[0] ? new Room(result.rows[0]) : null;
  }

  static async findByUuid(uuid) {
    const result = await db.query("SELECT * FROM rooms WHERE uuid = $1", [
      uuid,
    ]);
    return result.rows[0] ? new Room(result.rows[0]) : null;
  }

  static async findAll() {
    const result = await db.query("SELECT * FROM rooms");
    return result.rows.map((row) => new Room(row));
  }

  async update(data) {
    const { name, description, room_type, is_private } = data;
    const result = await db.query(
      "UPDATE rooms SET name = $1, description = $2, room_type = $3, is_private = $4 WHERE id = $5 RETURNING *",
      [name, description, room_type, is_private, this.id]
    );
    Object.assign(this, result.rows[0]);
    return this;
  }

  async delete() {
    await db.query("DELETE FROM rooms WHERE id = $1", [this.id]);
  }

  async incrementParticipants() {
    const result = await db.query(
      "UPDATE rooms SET participants = participants + 1 WHERE id = $1 RETURNING participants",
      [this.id]
    );
    this.participants = result.rows[0].participants;
    return this.participants;
  }

  async decrementParticipants() {
    const result = await db.query(
      "UPDATE rooms SET participants = participants - 1 WHERE id = $1 AND participants > 0 RETURNING participants",
      [this.id]
    );
    if (result.rows.length > 0) {
      this.participants = result.rows[0].participants;
      return this.participants;
    }
    return null;
  }
}

export default Room;
