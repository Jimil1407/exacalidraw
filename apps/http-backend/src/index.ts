import express, { Request, Response } from "express";
import jwt from "jsonwebtoken"; 
import { authMiddleware } from "./middleware";
import { JWT_SECRET } from "@repo/backend-common/config";
import { UserSchema } from "@repo/common/types";
import { SignInSchema } from "@repo/common/types";
import { RoomSchema } from "@repo/common/types";
import { prismaclient } from "@repo/db/client";
const app = express();

app.use(express.json());

app.post("/signup", async (req: Request, res: Response) => {
  const data = req.body;
  if(!data){
    return res.status(400).json({ error: "Data is required" });
  }
  const { email, password, name, photo } = UserSchema.parse(data);
  if (!email || !password || !name) {
    return res.status(400).json({ error: "Email, password and username are required" });
  }  

  try{
    const existingUser = await prismaclient.user.findFirst({
      where: { email },
    });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }
  } catch (error) {
    return res.status(400).json({ error: "User creation failed" });
  }

  const user = await prismaclient.user.create({
    data: { email, password, name, photo },
  });
  if (!user) {
    return res.status(400).json({ error: "User creation failed" });
  }

  res.status(200).json({ message: "User created successfully" });
});

app.post("/signin", async (req: Request, res: Response) => {
  const data = req.body;
  if(!data){
    return res.status(400).json({ error: "Data is required" });
  }
  const { email, password } = SignInSchema.parse(data);
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  const user = await prismaclient.user.findFirst({
    where: { email },
  });
  
  if (!user) {
    return res.status(400).json({ error: "User not found" });
  }
  
  if (user.password !== password) {
    return res.status(400).json({ error: "Invalid password" });
  }

  const token = jwt.sign({ email, userId: user.id }, JWT_SECRET);
  res.status(200).json({ token });
});

app.post("/create-room", authMiddleware, async (req: Request & { userId?: string }, res: Response) => {
  const data = req.body;
  if(!data){
    return res.status(400).json({ error: "Data is required" });
  }
  const { slug } = RoomSchema.parse(data);
  if (!slug) {
    return res.status(400).json({ error: "Slug is required" });
  }

  const room = await prismaclient.room.create({
    data: { slug, adminId: String(req.userId) },
  });
  if (!room) {
    return res.status(400).json({ error: "Room creation failed" });
  }
  res.status(200).json({ message: "Room created successfully" });
});

app.listen(3002, () => {
  console.log("Server is running on port 3002");
  console.log("http://localhost:3002");
});

    