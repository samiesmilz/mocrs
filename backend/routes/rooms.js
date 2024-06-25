// routes/roomRoutes.js

import express from "express";
import {
  getRooms,
  createRoom,
  getRoom,
  joinRoom,
  leaveRoom,
} from "../controllers/roomController.js";

const router = express.Router();

router.get("/", getRooms);
router.post("/", createRoom);
router.get("/:id", getRoom);
router.post("/:id/join", joinRoom);
router.post("/:id/leave", leaveRoom);

export default router;
