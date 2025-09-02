import cloudinary from "../config/cloudinary.js";
import Post from "../models/Post.js";

export const postController = {
  createPost: async (req, res, next) => {
    try {
      const { content } = req.body;
      let imageUrl = null;

      if (req.file) {
        const result = await new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { resource_type: "image" },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          );
          stream.end(req.file.buffer);
        });
        imageUrl = result.secure_url;
      }

      const post = await Post.create({
        author: req.userId,
        content,
        image: imageUrl,
      });

      res.status(201).json({ status: 201, data: post });
    } catch (error) {
      console.error(error);
      next(error);
    }
  },

  getAllPosts: async (req, res, next) => {
    try {
      const posts = await Post.find().populate(
        "author",
        "username email theme"
      );
      res.json({ data: posts });
    } catch (error) {
      console.error(error);
      next(error);
    }
  },

  getPostById: async (req, res, next) => {
    try {
      const post = await Post.findById(req.params.id).populate(
        "author",
        "username email theme"
      );
      if (!post) return res.status(404).json({ message: "Post not found" });
      res.json({ data: post });
    } catch (error) {
      console.error(error);
      next(error);
    }
  },

  likePost: async (req, res, next) => {
    try {
      const post = await Post.findById(req.params.id);
      if (!post) return res.status(404).json({ message: "Post not found" });

      const index = post.likes.indexOf(req.userId);
      if (index === -1) {
        post.likes.push(req.userId);
      } else {
        post.likes.splice(index, 1);
      }

      await post.save();
      res.json({ data: post });
    } catch (error) {
      console.error(error);
      next(error);
    }
  },

  deletePost: async (req, res, next) => {
    try {
      const post = await Post.findById(req.params.id);

      if (!post) return res.status(404).json({ message: "Post not found" });

      if (post.author.toString() !== req.userId) {
        return res
          .status(403)
          .json({ message: "You are not allowed to delete this post" });
      }

      await Post.findByIdAndDelete(req.params.id);

      res.json({
        status: 200,
        message: "Post deleted successfully",
        data: post,
      });
    } catch (error) {
      console.error(error);
      next(error);
    }
  },
};
