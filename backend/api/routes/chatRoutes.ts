import { Router, Request, Response } from "express";
import { WebSocketServerSingleton } from "../socket";

export const chatRouter = Router();

/**
 * Route to connect two clients.
 */
chatRouter.post("/connect", async (req: Request, res: Response) => {
  try {
    const { from, to } = req.body;

    if (!from || !to) {
      res.status(400).json({
        error: "Both from and to client IDs are required",
      });
      return;
    }

    // Get the WebSocket singleton instance (without recreating the server)
    const wsServer = WebSocketServerSingleton.getInstance();

    const success = wsServer.connectClients(from, to);

    if (!success) {
      res.status(404).json({
        error: "One or both clients not found or not connected",
      });
      return;
    }

    res.status(200).json({
      message: `Clients ${from} and ${to} are now connected.`,
    });
    return;
  } catch (error) {
    console.error("Error connecting clients:", error);
    res.status(500).json({ error: "Internal server error" });
    return;
  }
});

/**
 * Route to send a message between connected clients.
 */
//for testing
chatRouter.post("/message", async (req: Request, res: Response) => {
  try {
    const { from, to, text } = req.body;

    if (!from || !to || !text) {
      res.status(400).json({
        error: "Sender ID, recipient ID, and message text are required",
      });
    }

    // Get the WebSocket singleton instance
    const wsServer = WebSocketServerSingleton.getInstance();

    const success = wsServer.sendMessage(from, to, text);

    if (!success) {
      res.status(404).json({
        error:
          "Message could not be delivered. Client not found or not connected.",
      });
    }

    res.status(200).json({
      message: `Message sent from ${from} to ${to}.`,
    });
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default chatRouter;
