import WebSocket from "ws";
import http from "http";

const wsClients = new Map<string, WebSocket>(); // Store client WebSockets
const connections = new Map<string, string>(); // Store active chat connections

export class WebSocketServerSingleton {
  private static instance: WebSocketServerSingleton;
  private wss: WebSocket.Server;

  private constructor(server: http.Server) {
    this.wss = new WebSocket.Server({ server });

    this.wss.on("connection", (ws) => {
      console.log("Client connected");
      
      // Store temporary reference until registered with clientId
      let clientId: string | null = null;

      ws.on("message", (message: string) => {
        try {
          const data = JSON.parse(message.toString());

          switch (data.type) {
            case "register":
              if (this.registerClient(data.clientId, ws)) {
                clientId = data.clientId;
                ws.send(JSON.stringify({ type: "registered", success: true }));
              }
              break;
            case "connect":
              this.connectClients(data.from, data.to);
              break;
            case "message":
              this.sendMessage(data.from, data.to, data.text);
              break;
            default:
              console.warn("Unknown message type:", data.type);
          }
        } catch (error) {
          console.error("Invalid message format:", error);
        }
      });

      ws.on("close", () => {
        if (clientId) {
          this.removeClient(clientId);
        }
      });
    });
  }

  static getInstance(server?: http.Server): WebSocketServerSingleton {
    if (!WebSocketServerSingleton.instance) {
      if (!server) {
        throw new Error("Server instance required for WebSocket initialization.");
      }
      WebSocketServerSingleton.instance = new WebSocketServerSingleton(server);
    }
    return WebSocketServerSingleton.instance;
  }

  public registerClient(clientId: string, ws: WebSocket): boolean {
    if (wsClients.has(clientId)) {
      console.warn(`Client ID ${clientId} already in use.`);
      return false;
    }
    
    wsClients.set(clientId, ws);
    console.log(`Client ${clientId} registered.`);
    return true;
  }

  public connectClients(from: string, to: string): boolean {
    if (!wsClients.has(from) || !wsClients.has(to)) {
      console.warn(`Cannot connect: one or both clients not registered.`);
      return false;
    }
    
    connections.set(from, to);
    connections.set(to, from);
    
    // Notify both clients about the connection
    wsClients.get(from)?.send(JSON.stringify({ 
      type: "connected", 
      partner: to 
    }));
    
    wsClients.get(to)?.send(JSON.stringify({ 
      type: "connected", 
      partner: from 
    }));
    
    console.log(`Clients ${from} and ${to} are now connected.`);
    return true;
  }

  public sendMessage(from: string, to: string, text: string): boolean {
    if (!wsClients.has(to)) {
      console.warn(`Cannot send message: recipient ${to} not registered.`);
      return false;
    }
    
    wsClients.get(to)?.send(JSON.stringify({ 
      type: "message",
      from,
      text 
    }));
    
    return true;
  }

  public removeClient(clientId: string): void {
    if (wsClients.has(clientId)) {
      wsClients.delete(clientId);
      
      // Handle connected partner
      const connectedTo = connections.get(clientId);
      if (connectedTo) {
        connections.delete(connectedTo);
        wsClients.get(connectedTo)?.send(JSON.stringify({
          type: "disconnected",
          partner: clientId
        }));
      }
      
      connections.delete(clientId);
      console.log(`Client ${clientId} disconnected.`);
    }
  }

  // Helper method to stop the server
  public close(): void {
    this.wss.close();
    console.log("WebSocket server closed");
  }
}