import express, { Request, Response } from "express";
import jwt from "jsonwebtoken"; 
import { authMiddleware } from "./middleware";
import { JWT_SECRET } from "@repo/backend-common/config";
import { UserSchema } from "@repo/common/types";
import { SignInSchema } from "@repo/common/types";
import { RoomSchema } from "@repo/common/types";
const app = express();

app.use(express.json());

app.post("/signup", async (req: Request, res: Response) => {
  const data = req.body;
  if(!data){
    return res.status(400).json({ error: "Data is required" });
  }
  const { email, password, username } = UserSchema.parse(data);
  if (!email || !password || !username) {
    return res.status(400).json({ error: "Email, password and username are required" });
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

  const token = jwt.sign({ email }, JWT_SECRET);
  res.status(200).json({ token });
});

app.post("/create-room", authMiddleware, (req: Request, res: Response) => {
  res.send("Hello World");
  const data = req.body;
  if(!data){
    return res.status(400).json({ error: "Data is required" });
  }
  const { name } = RoomSchema.parse(data);
  if (!name) {
    return res.status(400).json({ error: "Name is required" });
  }

});

app.listen(3002, () => {
  console.log("Server is running on port 3002");
  console.log("http://localhost:3002");
});

    