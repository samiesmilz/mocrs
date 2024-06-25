"use strict";

/** Express app for mocrs. */
import express from "express";
import cors from "cors";

// Import routes and middleware
import authRoutes from "./routes/auth.js";
import usersRoutes from "./routes/users.js";
import roomRoutes from "./routes/rooms.js";
import { authenticateJWT } from "./middleware/auth.js";
import { NotFoundError } from "./middleware/expressError.js";
import { rateLimiter } from "./middleware/rateLimiter.js";
import morgan from "morgan";

// Set up the express app
const app = express();

// Middleware
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());
app.use(morgan("tiny"));
app.use(authenticateJWT);
app.use(rateLimiter);

// Routes to handle requests
app.use("/api/auth", authRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/rooms", roomRoutes);

/** Handle 404 errors -- this matches everything else */
app.use(function (req, res, next) {
  return next(new NotFoundError());
});

/** Generic error handler; anything unhandled goes here. */
app.use(function (err, req, res, next) {
  if (process.env.NODE_ENV !== "test") console.error(err.stack);
  const status = err.status || 500;
  const message = err.message;

  return res.status(status).json({
    error: { message, status },
  });
});

export default app;
