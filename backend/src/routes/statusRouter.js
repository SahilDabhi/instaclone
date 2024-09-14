import { Router } from "express";
import requireLogin from "../middlewares/requireLogin.js";
import upload from "../middlewares/upload.js";
import {
  createStatus,
  getAllStatus,
  getMyStatus,
  likeStatus,
  unlikeStatus,
} from "../controllers/statusController.js";

const router = Router();

router.route("/mystatus").get(requireLogin, getMyStatus);
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

export default router;
