import express, { Request, Response } from "express";
import jwt from "jsonwebtoken"; 
import { authMiddleware } from "./middleware";
import { JWT_SECRET } from "@repo/backend-common/config";

const app = express();

app.use(express.json());

app.post("/signup", async (req: Request, res: Response) => {
  const data = req.body;
  const { email, password, name } = data;
  if (!email || !password || !name) {
    return res.status(400).json({ error: "Email, password and name are required" });
  }  

  res.status(200).json({ message: "User created successfully" });
});

app.post("/signin", async (req: Request, res: Response) => {
  const data = req.body;
  const { email, password } = data;
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  const token = jwt.sign({ email }, JWT_SECRET);
  res.status(200).json({ token });
});

app.post("/create-room", authMiddleware, (req: Request, res: Response) => {
  res.send("Hello World");
});

app.listen(3002, () => {
  console.log("Server is running on port 3002");
  console.log("http://localhost:3002");
});

    