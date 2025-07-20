import jwt from "jsonwebtoken";
import { createError } from "../error.js";

export const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return next(createError(401, "No token provided"));
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT);
    req.user = { id: decoded.id }; // ✅ Properly store `id` in `req.user`

    return next();
  } catch (err) {
    return next(createError(403, "Invalid token"));
  }
};
