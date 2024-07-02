import Room from "../models/room";
import User from "../models/user";
import db from "../db";

let testUser;

async function commonBeforeAll() {
  // Clear the database
  await db.query("DELETE FROM rooms");
  await db.query("DELETE FROM users");

  // Create a test user
  testUser = await User.register({
    username: "testuser",
    firstName: "Test",
    lastName: "User",
    email: "testuser@test.com",
    password: "password123",
    isAdmin: false,
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

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

describe("Room Model", () => {
  async function createTestRoom() {
    return await Room.create({
      name: "Test Room",
      description: "Testing Room Description",
      room_type: "meeting",
      is_private: false,
      creator_id: testUser.id,
    });
  }

  test("should create a new room", async () => {
    const newRoomData = {
      name: "New Test Room",
      description: "New Testing Room Description",
      room_type: "focus",
      is_private: true,
      creator_id: testUser.id,
    };

    const newRoom = await Room.create(newRoomData);
    expect(newRoom).toHaveProperty("uuid");
    expect(newRoom.name).toBe(newRoomData.name);
    expect(newRoom.room_type).toBe(newRoomData.room_type);
    expect(newRoom.creator_id).toBe(testUser.id);
  });

  test("should fetch all rooms", async () => {
    await createTestRoom();
    const rooms = await Room.findAll();
    expect(rooms.length).toBeGreaterThan(0);
    expect(rooms[0]).toHaveProperty("uuid");
  });

  test("should fetch a room by UUID", async () => {
    const testRoom = await createTestRoom();
    const room = await Room.get(testRoom.uuid);
    expect(room).toHaveProperty("uuid", testRoom.uuid);
    expect(room.name).toBe(testRoom.name);
    expect(room.creator_id).toBe(testUser.id);
  });

  test("should increment participants when joining a room", async () => {
    const testRoom = await createTestRoom();
    const updatedRoom = await Room.join(testRoom.uuid);
    expect(updatedRoom.participants).toBe(1);
  });

  test("should decrement participants when leaving a room", async () => {
    const testRoom = await createTestRoom();
    await Room.join(testRoom.uuid);
    const updatedRoom = await Room.leave(testRoom.uuid);
    expect(updatedRoom.participants).toBe(0);
  });

  test("should update room details", async () => {
    const testRoom = await createTestRoom();
    const updatedRoomData = {
      name: "Updated Room Name",
      description: "Updated Room Description",
      room_type: "focus",
      is_private: true,
    };
    const updatedRoom = await Room.update(testRoom.uuid, updatedRoomData);
    expect(updatedRoom).toHaveProperty("name", updatedRoomData.name);
    expect(updatedRoom).toHaveProperty("room_type", updatedRoomData.room_type);
    expect(updatedRoom.creator_id).toBe(testUser.id);
  });

  test("should delete a room", async () => {
    const testRoom = await createTestRoom();
    await Room.remove(testRoom.uuid);
    await expect(Room.get(testRoom.uuid)).rejects.toThrow(
      `No room: ${testRoom.uuid}`
    );
  });
});
