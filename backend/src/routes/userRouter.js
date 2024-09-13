import { Router } from "express";
import { signup, login, createStatus } from "../controllers/userController.js";
import requireLogin from "../middlewares/requireLogin.js";
import upload from "../middlewares/upload.js";

const router = Router();

router.route("/signup").post(signup);
router.route("/login").post(login);

router
  .route("/createstatus")
  .post(
    requireLogin,
    upload.fields([{ name: "status", maxCount: 1 }]),
    createStatus
  );

export default router;
