import mongoose from "mongoose";
import { User } from "../models/User.js";
import jwt from "jsonwebtoken";
import express from "express";
import { protect } from "../middleware/authMiddleware.js";

const userRouter = express.Router();

// @route POST /api/users/register
// @desc Register a new user
// @access Public
userRouter.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  try {
    // Registration logic
    let user = await User.findOne({ email });

    if (user) return res.status(400).json({ message: "User already exists" });

    user = new User({ name, email, password });
    await user.save();

    // Create JWT Payload
    const payload = { user: { id: user._id, role: user.role } };

    // Sign and return the token along with the user data
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "24h" },
      (err, token) => {
        if (err) throw err;

        // Send the user and token response
        res.status(201).json({
          user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
          },
          token,
        });
      }
    );
  } catch (error) {
    console.log(error);
    res.status(500).send("Server Error");
  }
});

// @route POST /api/users/login
// @desc Authenticate a user
// @access Public
userRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find the user by email
    let user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid Credentials" });

    const isMatch = await user.matchPassword(password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid Credentials" });

    // Create JWT Payload
    const payload = { user: { id: user._id, role: user.role } };

    // Sign and return the token along with the user data
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "24h" },
      (err, token) => {
        if (err) throw err;

        // Send the user and token response
        res.json({
          user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
          },
          token,
        });
      }
    );
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

// @route GET /api/users/profile
// @desc Get logged-in user's profile {Protected Route}
// @access Private
userRouter.get("/profile", protect, async (req, res) => {
  res.json(req.user);
});

export { userRouter };
