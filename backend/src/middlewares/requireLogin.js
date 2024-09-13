import dotenv from "dotenv";
dotenv.config();
import jwt from "jsonwebtoken";

import { User } from "../models/userModel.js";

const requireLogin = async (req, res, next) => {
  try {
    const token =
      req.header("Authorization")?.replace("Bearer ", "") ||
      req.cookies?.accessToken;

    // console.log(token);
    if (!token) {
      return res.status(401).send("User must be logged in");
    }

    // console.log({ req, token });

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    // console.log(decodedToken);

    const user = await User.findById(decodedToken?._id).select("-password");

    if (!user) {
      return res.status(401).send("invalid token");
    }

    // console.log(user);

    req.user = user;

    next();
  } catch (error) {
    return res.status(401).send(error?.message || "Invalid access token");
  }
};

export default requireLogin;
