"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.chatRouter = void 0;
const express_1 = require("express");
const socket_1 = require("../socket");
exports.chatRouter = (0, express_1.Router)();
/**
 * Route to connect two clients.
 */
exports.chatRouter.post("/connect", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { from, to } = req.body;
        if (!from || !to) {
            res.status(400).json({
                error: "Both from and to client IDs are required",
            });
            return;
        }
        // Get the WebSocket singleton instance (without recreating the server)
        const wsServer = socket_1.WebSocketServerSingleton.getInstance();
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
    }
    catch (error) {
        console.error("Error connecting clients:", error);
        res.status(500).json({ error: "Internal server error" });
        return;
    }
}));
/**
 * Route to send a message between connected clients.
 */
//for testing
exports.chatRouter.post("/message", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { from, to, text } = req.body;
        if (!from || !to || !text) {
            res.status(400).json({
                error: "Sender ID, recipient ID, and message text are required",
            });
        }
        // Get the WebSocket singleton instance
        const wsServer = socket_1.WebSocketServerSingleton.getInstance();
        const success = wsServer.sendMessage(from, to, text);
        if (!success) {
            res.status(404).json({
                error: "Message could not be delivered. Client not found or not connected.",
            });
        }
        res.status(200).json({
            message: `Message sent from ${from} to ${to}.`,
        });
    }
    catch (error) {
        console.error("Error sending message:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}));
exports.default = exports.chatRouter;
