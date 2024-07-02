import Room from "../models/room.js";

/**
 * Get all rooms.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Next middleware function.
 */
export async function getRooms(req, res, next) {
  try {
    const rooms = await Room.findAll();
    res.json(rooms);
  } catch (err) {
    next(err);
  }
}

/**
 * Get all rooms by username
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Next middleware function.
 */
export async function findByCreator(req, res, next) {
  try {
    const { id } = req.body;
    const rooms = await Room.findByCreator(id);
    res.json(rooms);
  } catch (err) {
    next(err);
  }
}

/**
 * Create a new room.
 * @param {Object} req - Express request object with room data.
 * @param {Object} res - Express response object.
 * @param {Function} next - Next middleware function.
 */
export async function createRoom(req, res, next) {
  try {
    const { name, description, room_type, is_private, creator_id } = req.body;
    const room = await Room.create({
      name,
      description,
      room_type,
      is_private,
      creator_id,
    });
    res.status(201).json(room);
  } catch (err) {
    next(err);
  }
}

/**
 * Get a room by its UUID.
 * @param {Object} req - Express request object with room UUID.
 * @param {Object} res - Express response object.
 * @param {Function} next - Next middleware function.
 */
export async function getRoom(req, res, next) {
  try {
    const { id } = req.params;
    const room = await Room.get(id);
    res.json(room);
  } catch (err) {
    next(err);
  }
}

/**
 * Join a room.
 * @param {Object} req - Express request object with room UUID.
 * @param {Object} res - Express response object.
 * @param {Function} next - Next middleware function.
 */
export async function joinRoom(req, res, next) {
  try {
    const { id } = req.params;
    const room = await Room.join(id);
    res.json(room);
  } catch (err) {
    next(err);
  }
}

/**
 * Leave a room.
 * @param {Object} req - Express request object with room UUID.
 * @param {Object} res - Express response object.
 * @param {Function} next - Next middleware function.
 */
export async function leaveRoom(req, res, next) {
  try {
    const { id } = req.params;
    await Room.leave(id);
    res.sendStatus(204);
  } catch (err) {
    next(err);
  }
}
