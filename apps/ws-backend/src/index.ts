import WebSocket, { WebSocketServer } from "ws";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-common/config";

const wss = new WebSocketServer({ port: 8080 });
console.log("WebSocket server listening on ws://localhost:8080");

wss.on("connection", (ws: WebSocket & { userId: userId } & { url: string }) => {
  const url = ws.url;
  if(!url){
    ws.close();
    return;
  }
  const query = new URLSearchParams(url.split("?")[1] );
  const token = query.get("token");
  if(!token){
    ws.close();
    return;
  }
  const decoded = jwt.verify(token, JWT_SECRET) as jwt.JwtPayload;
  if (!decoded) {
    ws.close();
    return;
  }
  ws.userId = decoded.userId;
});

wss.on("error", (error) => {
  console.error("WebSocket error:", error);
});