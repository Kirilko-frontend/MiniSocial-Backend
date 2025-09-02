import express from "express";
import { userController } from "../controllers/userController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import multer from "multer";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.get("/me", authMiddleware, userController.getCurrentUser);

router.patch(
  "/me",
  authMiddleware,
  upload.single("image"),
  userController.patchUser
);

router.get("/:id", userController.getUserById);

router.get("/", authMiddleware, userController.getAllUsers);

router.delete("/:id", authMiddleware, userController.deleteUser);

export default router;
