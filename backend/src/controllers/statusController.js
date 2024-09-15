import { Status } from "../models/statusModel.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

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

const getAllStatus = async (req, res) => {
  try {
    const statuses = await Status.find()
      .populate("postedBy", "avatar username")
      .populate("comments.user", "username")
      .populate("likedBy", "username")
      .sort({ createdAt: -1 });

    res.status(200).json(statuses);
  } catch (error) {
    console.error("Error fetching statuses:", error);
    res.status(500).json({ message: "Failed to fetch statuses" });
  }
};

const getMyStatus = async (req, res) => {
  const posts = await Status.find({ postedBy: req.user._id })
    .populate("likedBy.user", "username")
    .populate("comments.user", "username avatar");
  res.status(200).json(posts);
};

const likeStatus = async (req, res) => {
  try {
    const { statusId } = req.body;
    const userId = req.user._id;

    const status = await Status.findById(statusId).populate(
      "postedBy",
      "_id username"
    );
    if (!status) {
      return res.status(404).json({ message: "Status not found" });
    }

    if (status.likedBy.includes(userId)) {
      return res
        .status(400)
        .json({ message: "You have already liked this status" });
    }

    status.likedBy.push(userId);
    await status.save();

    res.status(200).json({ message: "Status liked successfully", status });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

const unlikeStatus = async (req, res) => {
  try {
    const { statusId } = req.body;
    const userId = req.user._id;

    const status = await Status.findById(statusId).populate(
      "postedBy",
      "_id username"
    );
    if (!status) {
      return res.status(404).json({ message: "Status not found" });
    }

    if (!status.likedBy.includes(userId)) {
      return res
        .status(400)
        .json({ message: "You have not liked this status" });
    }

    status.likedBy.pull(userId);
    await status.save();

    res.status(200).json({ message: "Status unliked successfully", status });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

const commentStatus = async (req, res) => {
  try {
    const { statusId, comment, postedBy } = req.body;

    const status = await Status.findById(statusId);
    if (!status) {
      return res.status(404).json({ message: "Status not found" });
    }

    // console.log(status);

    const newComment = {
      comment,
      user: postedBy,
    };

    status.comments.push(newComment);

    await status.save();

    res.status(200).json({ message: "Comment added successfully", status });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

const deleteStatus = async (req, res) => {
  try {
    const { statusId } = req.body;
    console.log(statusId);

    const status = await Status.findById(statusId);
    if (!status) {
      return res.status(404).json({ message: "Status not found" });
    }

    if (status.postedBy.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // console.log(status);

    await Status.deleteOne({ _id: statusId });

    // console.log(status);

    res.status(200).json({ message: "Status deleted successfully" });
  } catch (error) {
    console.error("Error deleting status:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

const getMyFollowingStatus = async (req, res) => {
  try {
    const followingStatuses = await Status.find({
      postedBy: { $in: req.user.following },
    }).populate("postedBy", "username");

    const followerStatuses = await Status.find({
      postedBy: { $in: req.user.followers },
    }).populate("postedBy", "username");

    const statuses = [...followingStatuses, ...followerStatuses];

    res.status(200).json(statuses);
  } catch (error) {
    console.error("Error fetching statuses:", error);
    res.status(500).json({ message: "Failed to fetch statuses" });
  }
};

export {
  createStatus,
  getAllStatus,
  getMyStatus,
  getMyFollowingStatus,
  likeStatus,
  unlikeStatus,
  commentStatus,
  deleteStatus,
};
