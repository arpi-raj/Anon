"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = exports.sign = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const key = "Arpit Server";
const sign = (data) => {
    const payload = typeof data === "string" ? { value: JSON.parse(data) } : { value: data };
    return jsonwebtoken_1.default.sign(payload, key, { expiresIn: "1h" });
};
exports.sign = sign;
const verifyToken = (req, res, next) => {
    var _a;
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ message: "No token provided" });
    }
    const parts = authHeader.split(" ");
    if (parts.length !== 2 || parts[0] !== "Bearer") {
        return res.status(401).json({ message: "Invalid token format" });
    }
    const token = parts[1];
    try {
        const decoded = jsonwebtoken_1.default.verify(token, key);
        console.log("Decoded:", decoded);
        console.log("Decoded keys:", Object.keys(decoded));
        // Store the correct user object in req.user
        req.user = decoded.value;
        console.log("req.user:", req.user);
        console.log("req.user.id:", (_a = req.user) === null || _a === void 0 ? void 0 : _a.id); // Ensure safe access
        next();
    }
    catch (error) {
        return res.status(403).json({ message: "Failed to authenticate token" });
    }
};
exports.verifyToken = verifyToken;
