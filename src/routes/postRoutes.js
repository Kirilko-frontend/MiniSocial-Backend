import express from "express";
import { postController } from "../controllers/postController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { upload } from "../middleware/upload.js";

const router = express.Router();

router.post(
  "/",
  authMiddleware,
  upload.single("image"),
  postController.createPost
);
router.get("/", postController.getAllPosts);
router.get("/:id", postController.getPostById);
router.patch("/:id/like", authMiddleware, postController.likePost);
router.delete("/:id", authMiddleware, postController.deletePost);

export default router;
