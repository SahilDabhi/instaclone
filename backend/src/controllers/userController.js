import mongoose from "mongoose";
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

    const token = await jwt.sign({ _id: user._id }, process.env.JWT_SECRET);

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

const userProfile = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.params.id }).select(
      "-password -__v -createdAt -updatedAt -email"
    );

    // console.log("User:", user);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const posts = await Status.find({ postedBy: req.params.id }).populate(
      "postedBy",
      "_id"
    );

    // console.log("Posts:", posts);

    res.status(200).json({ user, posts });
  } catch (err) {
    res.status(422).json({ error: err.message });
  }
};

const followUser = async (req, res) => {
  try {
    const { followId } = req.body;
    const currentUserId = req.user._id;

    if (followId == currentUserId) {
      return res.status(400).json({ error: "You cannot follow yourself" });
    }

    const userToFollow = await User.findById(followId).select(
      "-password -__v -createdAt -updatedAt -email"
    );
    if (!userToFollow) {
      return res.status(404).json({ error: "User to follow not found" });
    }

    const currentUser = await User.findById(currentUserId).select(
      "-password -__v -createdAt -updatedAt -email"
    );
    if (!currentUser) {
      return res.status(404).json({ error: "Current user not found" });
    }

    if (currentUser.following.some((id) => id.equals(followId))) {
      return res
        .status(400)
        .json({ error: "You are already following this user" });
    }

    await User.findByIdAndUpdate(followId, {
      $push: { followers: currentUserId },
    });

    await User.findByIdAndUpdate(currentUserId, {
      $push: { following: followId },
    });

    res.status(200).json({ message: "User followed successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

const unfollowUser = async (req, res) => {
  try {
    const { unfollowId } = req.body;
    const currentUserId = req.user._id;

    if (unfollowId == currentUserId) {
      return res.status(400).json({ error: "You cannot unfollow yourself" });
    }

    const userToUnfollow = await User.findById(unfollowId).select(
      "-password -__v -createdAt -updatedAt -email"
    );
    if (!userToUnfollow) {
      return res.status(404).json({ error: "User to unfollow not found" });
    }

    const currentUser = await User.findById(currentUserId).select(
      "-password -__v -createdAt -updatedAt -email"
    );
    if (!currentUser) {
      return res.status(404).json({ error: "Current user not found" });
    }

    if (!currentUser.following.some((id) => id.equals(unfollowId))) {
      return res.status(400).json({ error: "You are not following this user" });
    }

    await User.findByIdAndUpdate(currentUser, {
      $pull: { following: unfollowId },
    });

    await User.findByIdAndUpdate(userToUnfollow, {
      $pull: { followers: currentUserId },
    });

    res.status(200).json({ message: "User unfollowed successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

const updateProfilePic = async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized log in first" });
  }

  if (!req.files.avatar) {
    return res.status(400).json({ message: "Please upload a picture" });
  }

  const profileLocalPath = req.files?.avatar[0].path;
  if (!profileLocalPath) {
    return res.status(400).json({ message: "Profile pic is required" });
  }

  const profile = await uploadOnCloudinary(profileLocalPath);

  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: { avatar: profile.url } },
      { new: true }
    ).select("-password -__v");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json(user);
  } catch (error) {
    console.error(error); // Log the error for debugging
    return res
      .status(500)
      .json({ message: "Something went wrong while uploading" });
  }
};

export {
  signup,
  login,
  userProfile,
  followUser,
  unfollowUser,
  updateProfilePic,
};
