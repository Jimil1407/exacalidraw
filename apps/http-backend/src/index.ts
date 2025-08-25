import express, { request, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { authMiddleware } from "./middleware";
import { JWT_SECRET } from "@repo/backend-common/config";
import { UserSchema } from "@repo/common/types";
import { SignInSchema } from "@repo/common/types";
import { RoomSchema } from "@repo/common/types";
import { prismaclient } from "@repo/db/client";
import cors from "cors";
const app = express();

app.use(express.json());
app.use(cors());

app.post("/signup", async (req: Request, res: Response) => {
  const data = req.body;
  if (!data) {
    return res.status(400).json({ error: "Data is required" });
  }
  const { email, password, name, photo } = UserSchema.parse(data);
  if (!email || !password || !name) {
    return res
      .status(400)
      .json({ error: "Email, password and username are required" });
  }

  try {
    const user = await prismaclient.user.create({
      data: { email, password, name, photo },
    });
    res.status(200).json({ message: "User created successfully", id: user.id });
  } catch (error) {
    return res
      .status(400)
      .json({
        error: "User creation failed",
        reason: error instanceof Error ? error.message : "Unknown error",
      });
  }
});

app.post("/signin", async (req: Request, res: Response) => {
  const data = req.body;
  if (!data) {
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

app.post(
  "/create-room",
  async (req: Request & { userId?: string }, res: Response) => {
    const data = req.body;
    if (!data) {
      return res.status(400).json({ error: "Data is required" });
    }
    const { slug } = RoomSchema.parse(data);
    if (!slug) {
      return res.status(400).json({ error: "Slug is required" });
    }

    // Block duplicate slugs
    const existing = await prismaclient.room.findUnique({ where: { slug } });
    if (existing) {
      return res.status(409).json({ error: "Slug already exists" });
    }

    const room = await prismaclient.room.create({
      data: { slug, adminId: String(req.userId) },
    });
    if (!room) {
      return res.status(400).json({ error: "Room creation failed" });
    }
    res.status(200).json({ message: "Room created successfully" , roomId : room.id});
  }
);

app.get("/chats/:roomId", async (req: Request , res: Response) => {
  const roomId = Number(req.params.roomId);
  if(Number.isNaN(roomId) || roomId <= 0){
    return res.status(400).json({ error: "Invalid roomId" })
  }
  const messages = await prismaclient.chat.findMany({
    where:{
      roomId : roomId
    },
    orderBy:{
      id: "desc"
    },
    take: 50
  })
  res.json({
    messages
  })
})

app.get("/room/:slug", async (req: Request, res: Response) => {
  const slug = String(req.params.slug);
  let room = await prismaclient.room.findFirst({
    where:{
      slug: slug
    }
  });
  
  // If room doesn't exist, create it
  if (!room) {
    // For now, we'll create with a default admin user
    // In a real app, you'd get the user from the session/token
    const defaultUser = await prismaclient.user.findFirst();
    if (!defaultUser) {
      return res.status(500).json({ error: "No users found in database" });
    }
    
    room = await prismaclient.room.create({
      data: {
        slug: slug,
        adminId: defaultUser.id
      }
    });
  }
  
  res.json({
    room
  })
})

app.listen(3002, () => {
  console.log("Server is running on port 3002");
  console.log("http://localhost:3002");
});
