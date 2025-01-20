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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
const prisma = new client_1.PrismaClient();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.listen(3000, () => {
    console.log("Server is running on http://localhost:3000");
});
app.post("/location", (req, res) => {
    console.log(req.body);
    const { latitude, longitude } = req.body;
    console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);
    res.send("Location received");
});
app.post("/signup", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password, name } = req.body;
    try {
        const result = yield prisma.user.create({
            data: {
                name,
                email,
                password,
            },
        });
        if (result) {
            console.log(result);
            console.log("User created successfully");
            res.status(201).send("User created successfully");
        }
    }
    catch (error) {
        console.error("Error creating user:", error);
        res.status(500).send("An error occurred while creating the user");
    }
}));
app.post("/signin", (req, res) => {
    res.send("Signin route");
});
exports.default = app;
//# sourceMappingURL=index.js.map