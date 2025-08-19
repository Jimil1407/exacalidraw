import WebSocket, { WebSocketServer } from "ws";

const wss = new WebSocketServer({ port: 8080 });
console.log("WebSocket server listening on ws://localhost:8080");

wss.on("connection", (ws: WebSocket) => {
  console.log("Client connected");
  ws.on("message", (message: string) => {
    console.log("Received message:", message);
  });
  ws.send("Hello from server");
});

wss.on("error", (error) => {
  console.error("WebSocket error:", error);
});