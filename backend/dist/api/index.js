"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = exports.app = void 0;
const express_1 = __importDefault(require("express"));
const express_2 = require("express");
const structure_1 = require("./structure");
const cors_1 = __importDefault(require("cors"));
exports.app = (0, express_1.default)();
exports.router = (0, express_2.Router)();
// Add body parsing middleware
exports.app.use(express_1.default.json());
exports.app.use(express_1.default.urlencoded({ extended: true }));
let noReq = 1;
// const clients: client[] = []; // Removed redeclaration
exports.app.use((0, cors_1.default)());
exports.app.use("/api", exports.router);
exports.router.post("/location", (req, res) => {
    //console.log(req.body);
    const client = req.body.client;
    client.id = noReq++; //should change this to a unique id
    //console.log(client);
    try {
        structure_1.clients.addClient(client);
        res.json({
            id: client.id,
            message: "Client added successfully",
        });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
exports.router.get("/allClients", (req, res) => {
    res.json(structure_1.clients.getAllClients());
});
exports.router.get("/client/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const client = structure_1.clients.getClient(id);
    if (client) {
        res.json(client);
    }
    else {
        res.status(404).json({ error: "Client not found" });
    }
});
exports.router.post("/chatableClients", (req, res) => {
    const client = req.body.client;
    console.log("hello there");
    console.log(client);
    const chatableClients = structure_1.clients.getchatableClients(client);
    res.json(chatableClients);
});
exports.app.listen(3000, () => {
    console.log("Server running on port 3000");
});
