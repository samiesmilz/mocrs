// routes/roomRoutes.js

import express from "express";
import {
  getRooms,
  createRoom,
  getRoom,
  joinRoom,
  leaveRoom,
  findByCreator,
} from "../controllers/room.js";

const router = express.Router();
router.get("/", getRooms);
router.post("/", createRoom);
router.get("/:id", getRoom);
router.post("/:id/join", joinRoom);
router.post("/:id/leave", leaveRoom);
router.get("/user/:id", findByCreator);

export default router;
