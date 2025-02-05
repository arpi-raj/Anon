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
exports.router.get("/chatable", (req, res) => {
    const client = req.body.client;
    try {
        const chatable = structure_1.clients.getChatableClients(client);
        console.log(chatable);
        res.json(chatable);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
        console.log(error);
    }
});
exports.app.listen(3000, () => {
    console.log("Server running on port 3000");
});
