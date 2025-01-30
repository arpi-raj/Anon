"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = __importStar(require("ws"));
const express_1 = __importDefault(require("express"));
const port = 8080;
const app = (0, express_1.default)();
const server = app.listen(port, () => {
    console.log(`Server started on port ${port}.`);
});
const wss = new ws_1.Server({ server });
wss.on("connection", (ws) => {
    console.log("Client connected.");
    ws.on("message", (message) => {
        console.log(`Received: ${message}`);
        const decodedMessage = message.toString;
        const isbinary = false; // Define the isbinary variable
        // Broadcast to all connected clients including the sender
        wss.clients.forEach((client) => {
            if (client.readyState === ws_1.default.OPEN) {
                client.send(message, { binary: isbinary }, (error) => {
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
    ws.on("error", (error) => {
        console.error("WebSocket error:", error);
    });
});
