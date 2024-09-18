import mongoose, { Types } from "mongoose";

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    avatar: {
      type: String, // url in sting default image given
      default:
        "https://res.cloudinary.com/dg5fv76tj/image/upload/fl_preserve_transparency/v1726415010/vector-flat-illustration-grayscale-avatar-600nw-2264922221_zp7psm.jpg?_s=public-apps",
    },
    followers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    following: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);

userSchema.index({ followers: 1 });
userSchema.index({ following: 1 });

export const User = mongoose.model("User", userSchema);
