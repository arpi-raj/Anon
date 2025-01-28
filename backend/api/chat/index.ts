import WebSocket, { Server } from "ws";
import express from "express";

const port: number = 8080;

const app = express();

const server = app.listen(port, () => {
  console.log(`Server started on port ${port}.`);
});

const wss = new Server({ server });

wss.on("connection", (ws: WebSocket) => {
  console.log("Client connected.");

  ws.on("message", (message: string) => {
    console.log(`Received: ${message}`);
    const decodedMessage = message.toString;
    const isbinary = false; // Define the isbinary variable

    // Broadcast to all connected clients including the sender
    wss.clients.forEach((client: WebSocket) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message, { binary: isbinary }, (error?: Error) => {
          if (error) {
            console.error("Error sending message:", error);
          }
        });
      }
    });
  });

  ws.on("close", () => {
    console.log("Client disconnected.");
  });

  ws.on("error", (error: Error) => {
    console.error("WebSocket error:", error);
  });
});
