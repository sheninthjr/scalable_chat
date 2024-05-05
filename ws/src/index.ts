import { WebSocketServer } from "ws";
import { UserManager } from "./UserManager";

const wss = new WebSocketServer({ port: 8080 });

wss.on("connection", (ws) => {
  ws.on("message", (data) => {
    const message = JSON.parse(data.toString());
    if (message.type === "join") {
      const { roomId, userId } = message.payload;
      UserManager.getInstance().subscribe(roomId, userId, ws);
    }
    if (message.type === "message") {
      const { roomId, userId, chat } = message.payload;
      UserManager.getInstance().sendChat(roomId, userId, chat);
    }
  });
  ws.send("Hello from websocket server.");
});
