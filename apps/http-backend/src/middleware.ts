import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-common/config";


export const authMiddleware = (req: Request & { userId?: string }, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    const decoded = jwt.verify(token as string, JWT_SECRET);
    if (typeof decoded === "object" && decoded !== null && "userId" in decoded) {
      req.userId = decoded.userId;
      next();
    } else {
      return res.status(403).json({ error: "Unauthorized" });
    }
  } catch (error) {
    return res.status(401).json({ error: "Unauthorized" });
  }
}; 

