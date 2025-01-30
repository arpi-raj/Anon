"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_2 = require("express");
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
const router = (0, express_2.Router)();
// Add body parsing middleware
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
function toRadians(degrees) {
    return (degrees * Math.PI) / 180;
}
let noReq = 1;
function calculateDistance(latitude1, longitude1, latitude2, longitude2) {
    const R = 6371000; // Radius of the Earth in meters
    const dLat = toRadians(latitude2 - latitude1);
    const dLon = toRadians(longitude2 - longitude1);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRadians(latitude1)) *
            Math.cos(toRadians(latitude2)) *
            Math.sin(dLon / 2) *
            Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in meters
}
const clients = [];
app.use((0, cors_1.default)());
app.use("/api", router);
router.post("/location", (req, res) => {
    //console.log(req.body);
    const { prefRadius, latitude, longitude } = req.body;
    const client = { prefRadius, latitude, longitude };
    clients.push(client);
    console.log(client);
    console.log(noReq);
    noReq++;
    res.send("Location added");
});
router.get("/location", (req, res) => {
    const { latitude, longitude, prefRadius } = req.query;
    const clientsWithinRadius = clients.filter((client) => {
        const distance = calculateDistance(client.latitude, client.longitude, parseFloat(latitude), parseFloat(longitude));
        console.log(distance);
        return (distance <= parseFloat(prefRadius) &&
            distance <= client.prefRadius);
    });
    res.json(clientsWithinRadius);
});
app.listen(3000, () => {
    console.log("Server running on port 3000");
});
