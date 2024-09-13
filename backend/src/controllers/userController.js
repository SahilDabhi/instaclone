import { User } from "../models/userModel.js";
import { Status } from "../models/statusModel.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
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
    return res.status(400).send({ message: "All details required" });
  }

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(404).send({ message: "User not found Please signin" });
  }

  const correctPassword = await bcrypt.compare(password, user.password);

  if (!correctPassword) {
    return res.status(400).send({ message: "Invalid credentials" });
  }

  const token = await jwt.sign({ _id: user.id }, process.env.JWT_SECRET);
  console.log(token);

  return res.status(200).send({ message: "Login successful", token: token });
};

const createStatus = async (req, res) => {
  const { statusCaption } = req.body;

  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized login first" });
  }

  const statusLocalPath = req.files?.status[0].path;
  if (!statusLocalPath) {
    return res.status(400).json({ message: "status file is required" });
  }

  const status = await uploadOnCloudinary(statusLocalPath);

  try {
    const statu = new Status({
      status: status.url,
      statusCaption,
      postedBy: req.user._id,
    });

    const savedStatus = await statu.save();

    return res.status(201).json(savedStatus);
  } catch (error) {
    console.log(error);
    return res.status(500).json("Somethiing went wrong while uploading");
  }
};

export { signup, login, createStatus };
