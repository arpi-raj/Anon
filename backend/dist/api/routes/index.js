"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const express_2 = require("express");
const chatRoutes_1 = __importDefault(require("./chatRoutes"));
const structure_1 = require("../structure");
const jwtAuth_1 = require("../../Middleware/jwtAuth");
const cors_1 = __importDefault(require("cors"));
const http_1 = __importDefault(require("http"));
const socket_1 = require("../socket");
// Create Express app
exports.app = (0, express_1.default)();
exports.app.use(express_1.default.json());
exports.app.use(express_1.default.urlencoded({ extended: true }));
exports.app.use((0, cors_1.default)());
// Create HTTP server from Express app
const server = http_1.default.createServer(exports.app);
const key = "Arpit Server";
// Initialize WebSocket server with the HTTP server
const wss = socket_1.WebSocketServerSingleton.getInstance(server);
// Store pending WebSocket registrations
const pendingConnections = new Map();
// Setup routers
const router = (0, express_2.Router)();
exports.app.use("/api", router);
exports.app.use("/api/chat", chatRoutes_1.default);
let noReq = 1;
router.post("/addClient", (req, res) => {
    try {
        const { coords, userName, prefRad } = req.body;
        console.log(coords);
        // Ensure client object is created properly
        const client = {
            id: Date.now(), // Generate a unique ID
            userName,
            coords,
            prefRadius: prefRad,
            blkFlag: 0,
            blkList: [],
            chatable: [],
        };
        structure_1.clients.addClient(client);
        console.log("Client added:", client);
        // Generate token for WebSocket authentication
        const token = (0, jwtAuth_1.sign)(JSON.stringify(client));
        // Store token mapping for later verification during WebSocket connection
        pendingConnections.set(token, client.id);
        // Set token expiration (optional, for security)
        setTimeout(() => {
            pendingConnections.delete(token);
        }, 5 * 60 * 1000); // 5 minutes
        res.json({
            id: client.id,
            token: token,
            message: "Client added successfully. Use token to establish WebSocket connection.",
        });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
router.get("/allClients", (req, res) => {
    try {
        const allClients = structure_1.clients.getAllClients();
        const sanitizedClients = allClients.map((_a) => {
            var { blkList, chatable } = _a, client = __rest(_a, ["blkList", "chatable"]);
            return client;
        });
        res.json(sanitizedClients);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
router.post("/verifyClient", jwtAuth_1.verifyToken, (req, res) => {
    var _a;
    res.json({ message: "Client verified", id: (_a = req.user) === null || _a === void 0 ? void 0 : _a.id });
});
router.get("/client/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const client = structure_1.clients.getClient(id);
    if (client) {
        res.json(client);
    }
    else {
        res.status(404).json({ error: "Client not found" });
    }
});
router.get("/chatable", jwtAuth_1.verifyToken, // Verify token before proceeding
(req, res) => {
    var _a;
    const id = parseInt((_a = req.user) === null || _a === void 0 ? void 0 : _a.id);
    if (!id) {
        res.status(400).json({ error: "Client data is required" });
    }
    try {
        console.log(id);
        const chatable = structure_1.clients.getChatableClients(id);
        console.log("Final chatable clients:", chatable);
        res.json(chatable);
    }
    catch (error) {
        console.error("Error:", error);
        res.status(400).json({ error: error.message });
    }
});
// Start ONE server that handles both HTTP and WebSockets
const PORT = process.env.SERVER_PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT} (HTTP and WebSocket)`);
});
