import express from "express";
import { authController } from "../controllers/authController.js";
import { upload } from "../middleware/upload.js";

const router = express.Router();

router.post(
  "/register",
  upload.single("image"),
  authController.registerUserWithPhoto
);
router.post("/login", authController.loginUser);

export default router;
