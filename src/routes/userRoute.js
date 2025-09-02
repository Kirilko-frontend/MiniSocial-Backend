import express from "express";
import { userController } from "../controllers/userController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import multer from "multer";
const router = express.Router();

const upload = multer({ storage: multer.memoryStorage() });

router.patch(
  "/:id",
  authMiddleware,
  upload.single("image"),
  userController.patchUser
);
router.get("/me", authMiddleware, userController.getCurrentUser);
router.get("/:id", authMiddleware, userController.getUserById);
router.get("/", authMiddleware, userController.getAllUsers);
router.delete("/", authMiddleware, userController.deleteUser);

export default router;
