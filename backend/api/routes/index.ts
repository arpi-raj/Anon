import express from "express";
import { Router, RequestHandler as middleware } from "express";
import chatRouter from "./chatRoutes";
import { clients, Client } from "../structure";
import { verifyToken, sign } from "../../Middleware/jwtAuth";
import cors from "cors";
import http from "http";
import { WebSocketServerSingleton } from "../socket";
import { randomUUID } from "crypto";
import { json } from "stream/consumers";

// Create Express app
export const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Create HTTP server from Express app
const server = http.createServer(app);
const key = "Arpit Server";
// Initialize WebSocket server with the HTTP server
const wss = WebSocketServerSingleton.getInstance(server);

// Store pending WebSocket registrations
const pendingConnections = new Map<string, number>();

// Setup routers
const router = Router();
app.use("/api", router);
app.use("/api/chat", chatRouter);

let noReq: number = 1;

router.post("/addClient", (req, res) => {
  try {
    const { coords, userName, prefRad } = req.body;
    console.log(coords);

    // Ensure client object is created properly
    const client: Client = {
      id: Date.now(), // Generate a unique ID
      userName,
      coords,
      prefRadius: prefRad,
      blkFlag: 0,
      blkList: [],
      chatable: [],
    };
    clients.addClient(client);
    console.log("Client added:", client);

    // Generate token for WebSocket authentication
    const token = sign(JSON.stringify(client));

    // Store token mapping for later verification during WebSocket connection
    pendingConnections.set(token, client.id);

    // Set token expiration (optional, for security)
    setTimeout(
      () => {
        pendingConnections.delete(token);
      },
      5 * 60 * 1000
    ); // 5 minutes

    res.json({
      id: client.id,
      token: token,
      message:
        "Client added successfully. Use token to establish WebSocket connection.",
    });
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

router.get("/allClients", (req, res) => {
  try {
    const allClients = clients.getAllClients();
    const sanitizedClients = allClients.map(
      ({ blkList, chatable, ...client }) => client
    );
    res.json(sanitizedClients);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

router.post(
  "/verifyClient",
  verifyToken as middleware,
  (req: express.Request, res: express.Response) => {
    res.json({ message: "Client verified", id: (req as any).user?.id });
  }
);

router.get("/client/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const client = clients.getClient(id);
  if (client) {
    res.json(client);
  } else {
    res.status(404).json({ error: "Client not found" });
  }
});

router.get(
  "/chatable",
  verifyToken as middleware, // Verify token before proceeding
  (req, res) => {
    const id = parseInt((req as any).user?.id);
    if (!id) {
      res.status(400).json({ error: "Client data is required" });
    }

    try {
      console.log(id);
      const chatable = clients.getChatableClients(id);
      console.log("Final chatable clients:", chatable);
      res.json(chatable);
    } catch (error) {
      console.error("Error:", error);
      res.status(400).json({ error: (error as Error).message });
    }
  }
);

// Start ONE server that handles both HTTP and WebSockets
const PORT = process.env.SERVER_PORT || 3000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT} (HTTP and WebSocket)`);
});
