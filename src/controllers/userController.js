import User from "../models/User.js";

export const userController = {
  getCurrentUser: async (req, res, next) => {
    try {
      const user = await User.findById(req.userId);
      if (!user) return res.status(404).json({ message: "User not found" });

      const { password, ...userData } = user._doc;
      res.json({ data: userData });
    } catch (error) {
      console.error(error);
      next(error);
    }
  },
  getUserById: async (req, res, next) => {
    try {
      const user = await User.findById(req.params.id);
      if (!user) return res.status(404).json({ message: "User not found" });

      const { password, ...userData } = user._doc;
      res.json({ data: userData });
    } catch (error) {
      console.error(error);
      next(error);
    }
  },
  getAllUsers: async (req, res, next) => {
    try {
      const users = await User.find();
      const usersData = users.map((u) => {
        const { password, ...userData } = u._doc;
        return userData;
      });
      res.json({ data: usersData });
    } catch (error) {
      console.error(error);
      next(error);
    }
  },
  deleteUser: async (req, res, next) => {
    try {
      const user = await User.findByIdAndDelete(req.params.id);
      if (!user) return res.status(404).json({ message: "User not found" });

      const { password, ...userData } = user._doc;
      res.json({ data: userData });
    } catch (error) {
      console.error(error);
      next(error);
    }
  },
  patchUser: async (req, res, next) => {
    try {
      const { username, email, password } = req.body;
      const updateData = {};

      if (username) updateData.username = username;
      if (email) updateData.email = email;
      if (password) {
        const salt = await bcrypt.genSalt(10);
        updateData.password = await bcrypt.hash(password, salt);
      }

      if (req.file) {
        const result = await cloudinary.uploader.upload_stream(
          { folder: "avatars" },
          (error, result) => {
            if (error) throw error;
            updateData.image = result.secure_url;
          }
        );
        result.end(req.file.buffer);
      }

      const user = await User.findByIdAndUpdate(req.userId, updateData, {
        new: true,
      });

      if (!user) {
        return res.status(404).json({ status: 404, message: "User not found" });
      }

      const { password: pw, ...userData } = user._doc;
      res.json({ status: 200, data: userData });
    } catch (err) {
      console.error(error);
      next(error);
    }
  },
};
