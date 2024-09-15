import { Router } from "express";
import requireLogin from "../middlewares/requireLogin.js";
import upload from "../middlewares/upload.js";
import {
  createStatus,
  getAllStatus,
  likeStatus,
  unlikeStatus,
  commentStatus,
  deleteStatus,
} from "../controllers/statusController.js";

const router = Router();

router.route("/allstatus").get(requireLogin, getAllStatus);
router
  .route("/createstatus")
  .post(
    requireLogin,
    upload.fields([{ name: "status", maxCount: 1 }]),
    createStatus
  );

router.route("/like").put(requireLogin, likeStatus);
router.route("/unlike").put(requireLogin, unlikeStatus);

router.route("/comment").put(requireLogin, commentStatus);
router.route("/delete").post(requireLogin, deleteStatus);

export default router;
