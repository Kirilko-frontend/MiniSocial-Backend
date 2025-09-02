import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { getEnvVar } from "../utils/getEnvVar.js";
import cloudinary from "../config/cloudinary.js";
import User from "../models/User.js";

const uploadToCloudinary = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { resource_type: "image" },
      (error, result) => {
        if (error) return reject(error);
        resolve(result.secure_url);
      }
    );
    stream.end(fileBuffer);
  });
};

export const authController = {
  registerUserWithPhoto: async (req, res, next) => {
    try {
      const { username, email, password } = req.body;
      const file = req.file;

      if (!username || !email || !password) {
        return res.status(400).json({ message: "All fields are required" });
      }

      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res
          .status(400)
          .json({ message: "User with this email already exists" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      let imageUrl = null;
      if (file) {
        imageUrl = await uploadToCloudinary(file.buffer);
      }

      const user = await User.create({
        username,
        email,
        password: hashedPassword,
        image: imageUrl,
      });

      const { password: _, ...userData } = user._doc;
      res.status(201).json({ message: "User created", data: userData });
    } catch (error) {
      console.error(error);
      next(error);
    }
  },

  loginUser: async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ status: 400, message: "Password or email is incorrect" });
    }

    try {
      const user = await User.findOne({ email });
      if (!user)
        return res
          .status(400)
          .json({ status: 400, message: "Password or email is incorrect" });

      const checkPassword = await bcrypt.compare(password, user.password);
      if (!checkPassword)
        return res
          .status(400)
          .json({ status: 400, message: "Password or email is incorrect" });

      const token = jwt.sign({ id: user._id }, getEnvVar("JWT_SECRET"), {
        expiresIn: "1h",
      });

      res
        .cookie("token", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          maxAge: 3600000,
          sameSite: "lax",
        })
        .status(200)
        .json({ status: 200, message: "Login successful" });
    } catch (error) {
      console.log(error);
      next(error);
    }
  },
};
