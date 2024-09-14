import { Router } from "express";
import { signup, login, userProfile } from "../controllers/userController.js";

const router = Router();

router.route("/signup").post(signup);
router.route("/login").post(login);
router.route("/user/:id").get(userProfile);

export default router;
