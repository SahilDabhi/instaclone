import { Router } from "express";
import requireLogin from "../middlewares/requireLogin.js";
import upload from "../middlewares/upload.js";
import {
  signup,
  login,
  userProfile,
  followUser,
  unfollowUser,
  updateProfilePic,
} from "../controllers/userController.js";
import {
  getMyStatus,
  getMyFollowingStatus,
} from "../controllers/statusController.js";

const router = Router();

router.route("/signup").post(signup);
router.route("/login").post(login);

router.route("/mystatus").get(requireLogin, getMyStatus);
router.route("/myfollowing").get(requireLogin, getMyFollowingStatus);
router
  .route("/updateprofilepic")
  .post(requireLogin, upload.single("avatar"), updateProfilePic);

router.route("/follow").put(requireLogin, followUser);
router.route("/unfollow").put(requireLogin, unfollowUser);
router.route("/:id").get(userProfile);

export default router;
