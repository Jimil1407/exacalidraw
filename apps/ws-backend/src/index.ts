import WebSocket, { WebSocketServer } from "ws";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-common/config";
import { prismaclient } from "@repo/db/client";
import http from "http";

const PORT = process.env.PORT || 8080;

// Create HTTP server for health checks
const server = http.createServer((req, res) => {
  if (req.url === "/" || req.url === "/health") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ status: "ok", service: "websocket", timestamp: new Date().toISOString() }));
  } else {
    res.writeHead(404);
    res.end("Not Found");
  }
});

// Create WebSocket server attached to HTTP server
const wss = new WebSocketServer({ server });

server.listen(PORT, () => {
  console.log(`WebSocket server listening on ws://localhost:${PORT}`);
  console.log(`HTTP server listening on http://localhost:${PORT}`);
});

interface User {
  userId: string;
  ws: WebSocket;
  rooms: string[];
}

const users: User[] = [];

function checkUser(token: string): string | null {
  try {
    if (!JWT_SECRET) {
      console.error("JWT_SECRET not configured");
      return null;
    }
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    if (!decoded || !decoded.userId) {
      return null;
    }
    return decoded.userId;
  } catch (e) {
    return null;
  }
}

wss.on("connection", (ws: WebSocket, request) => {
  console.log("New WebSocket connection attempt");
  
  // Get URL from the request
  const url = request.url;
  if (!url) {
    console.log("No URL provided, closing connection");
    ws.close();
    return;
  }
  
  const queryParams = new URLSearchParams(url.split("?")[1]);
  const token = queryParams.get("token") || "";
  if (!token) {
    console.log("No token provided, closing connection");
    ws.close();
    return;
  }
  
  const id = checkUser(token);
  if (!id) {
    console.log("Invalid token, closing connection");
    ws.close();
    return;
  }

  console.log(`User ${id} connected successfully`);

  users.push({
    userId: id,
    rooms: [],
    ws,
  });

  ws.on("message", async function message(data) {
    try {
      const parseddata = JSON.parse(data.toString());

      if (parseddata.type == "join_room") {
        const user = users.find((x) => x.ws === ws);
        if (user && !user.rooms.includes(parseddata.roomId.toString())) {
          user.rooms.push(parseddata.roomId.toString());
          console.log(`User ${user.userId} joined room ${parseddata.roomId}`);
        }
      }

      if (parseddata.type == "leave_room") {
        const user = users.find((x) => x.ws === ws);
        if (user) {
          user.rooms = user.rooms.filter((x) => x !== parseddata.roomId.toString());
          console.log(`User ${user.userId} left room ${parseddata.roomId}`);
        }
      }

      if (parseddata.type == "chat") {
        const roomId = parseddata.roomId;
        const message1 = parseddata.message;

        const created = await prismaclient.chat.create({
          data:{
            roomId,
            message: message1,
            userId: id
          } 
        });
        
        users.forEach((user) => {
          if (user.rooms.includes(roomId.toString())) {
            user.ws.send(
              JSON.stringify({
                type: "chat",
                message: message1,
                roomId,
                chatId: created.id
              })
            );
          }
        });
      }

      if (parseddata.type == "update") {
        const roomId = parseddata.roomId;
        const chatId: number = parseddata.chatId;
        const message1: string = parseddata.message;
        try {
          const updated = await prismaclient.chat.update({
            where: { id: chatId },
            data: { message: message1 }
          });
          users.forEach((user) => {
            if (user.rooms.includes(roomId.toString())) {
              user.ws.send(
                JSON.stringify({
                  type: "update",
                  roomId,
                  chatId: updated.id,
                  message: updated.message
                })
              );
            }
          });
        } catch (e) {
          // ignore if missing
        }
      }
      if (parseddata.type == "erase") {
        const roomId = parseddata.roomId;
        const chatId: number = parseddata.chatId;

        if (typeof chatId === "number") {
          try {
            await prismaclient.chat.delete({ where: { id: chatId } });
          } catch (e) {
            // ignore if already deleted
          }
          users.forEach((user) => {
            if (user.rooms.includes(roomId.toString())) {
              user.ws.send(
                JSON.stringify({
                  type: "erase",
                  roomId,
                  chatId
                })
              );
            }
          });
        }
      }
    } catch (error) {
      console.error("Error processing message:", error);
    }
  });

  ws.on("close", () => {
    const userIndex = users.findIndex((x) => x.ws === ws);
    if (userIndex !== -1) {
      const user = users[userIndex];
      if (user) {
        console.log(`User ${user.userId} disconnected`);
        users.splice(userIndex, 1);
      }
    }
  });

  ws.on("error", (error) => {
    console.error("WebSocket client error:", error);
  });
});

wss.on("error", (error) => {
  console.error("WebSocket server error:", error);
});
