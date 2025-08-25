import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-common/config";


export const authMiddleware = (req: Request & { userId?: string }, res: Response, next: NextFunction) => {
  try {
    if (!JWT_SECRET) {
      return res.status(500).json({ error: "JWT_SECRET not configured" });
    }
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ error: "No token provided" });
    }
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    req.userId = decoded.userId;
    next();
  } catch (error) {
    return res.status(401).json({ error: "Unauthorized" });
  }
}; 

