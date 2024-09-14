import { User } from "../models/userModel.js";

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import dotenv from "dotenv";
dotenv.config();

const signup = async (req, res) => {
  const { fullName, email, username, password } = req.body;

  if (!username || !email || !fullName || !password) {
    return res.status(400).send({ message: "All details required" });
  }

  const emailRegex = /^[\w._%+-]+@[\w.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(email)) {
    return res.status(400).send({ message: "Invalid email" });
  }

  if (password.length < 4) {
    return res
      .status(400)
      .send({ message: "Password must be at least 4 characters" });
  }

  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (existedUser) {
    return res
      .status(409)
      .send({ message: "User with email or username already exists" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    fullName,
    email,
    password: hashedPassword,
    username: username.toLowerCase(),
  });

  return res
    .status(200)
    .send({ message: "Created successfully", username, email, fullName });
};

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "All details required" });
  }

  try {
    const user = await User.findOne({ email }).populate();

    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found. Please sign up." });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = await jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "24h",
    });

    const {
      password: _,
      createdAt,
      updatedAt,
      __v,
      avatar,
      ...userObject
    } = user.toObject();

    return res
      .status(200)
      .json({ message: "Login successful", token, user: userObject });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export { signup, login };
