import jwt from "jsonwebtoken";
import { getEnvVar } from "../utils/getEnvVar.js";

export const authMiddleware = (req, res, next) => {
  const token = req.cookies?.token;
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, getEnvVar("JWT_SECRET"));
    req.userId = decoded.id;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};
