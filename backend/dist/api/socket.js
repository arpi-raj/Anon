"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebSocketServerSingleton = void 0;
const ws_1 = __importDefault(require("ws"));
const wsClients = new Map(); // Store client WebSockets
const connections = new Map(); // Store active chat connections
class WebSocketServerSingleton {
    constructor(server) {
        this.wss = new ws_1.default.Server({ server });
        this.wss.on("connection", (ws) => {
            console.log("Client connected");
            // Store temporary reference until registered with clientId
            let clientId = null;
            ws.on("message", (message) => {
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
                }
                catch (error) {
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
    static getInstance(server) {
        if (!WebSocketServerSingleton.instance) {
            if (!server) {
                throw new Error("Server instance required for WebSocket initialization.");
            }
            WebSocketServerSingleton.instance = new WebSocketServerSingleton(server);
        }
        return WebSocketServerSingleton.instance;
    }
    registerClient(clientId, ws) {
        if (wsClients.has(clientId)) {
            console.warn(`Client ID ${clientId} already in use.`);
            return false;
        }
        wsClients.set(clientId, ws);
        console.log(`Client ${clientId} registered.`);
        return true;
    }
    connectClients(from, to) {
        var _a, _b;
        if (!wsClients.has(from) || !wsClients.has(to)) {
            console.warn(`Cannot connect: one or both clients not registered.`);
            return false;
        }
        connections.set(from, to);
        connections.set(to, from);
        // Notify both clients about the connection
        (_a = wsClients.get(from)) === null || _a === void 0 ? void 0 : _a.send(JSON.stringify({
            type: "connected",
            partner: to
        }));
        (_b = wsClients.get(to)) === null || _b === void 0 ? void 0 : _b.send(JSON.stringify({
            type: "connected",
            partner: from
        }));
        console.log(`Clients ${from} and ${to} are now connected.`);
        return true;
    }
    sendMessage(from, to, text) {
        var _a;
        if (!wsClients.has(to)) {
            console.warn(`Cannot send message: recipient ${to} not registered.`);
            return false;
        }
        (_a = wsClients.get(to)) === null || _a === void 0 ? void 0 : _a.send(JSON.stringify({
            type: "message",
            from,
            text
        }));
        return true;
    }
    removeClient(clientId) {
        var _a;
        if (wsClients.has(clientId)) {
            wsClients.delete(clientId);
            // Handle connected partner
            const connectedTo = connections.get(clientId);
            if (connectedTo) {
                connections.delete(connectedTo);
                (_a = wsClients.get(connectedTo)) === null || _a === void 0 ? void 0 : _a.send(JSON.stringify({
                    type: "disconnected",
                    partner: clientId
                }));
            }
            connections.delete(clientId);
            console.log(`Client ${clientId} disconnected.`);
        }
    }
    // Helper method to stop the server
    close() {
        this.wss.close();
        console.log("WebSocket server closed");
    }
}
exports.WebSocketServerSingleton = WebSocketServerSingleton;
