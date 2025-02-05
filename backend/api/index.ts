import express from "express";
import { Router, Request, Response } from "express";

import { clients, Client, ClientManager } from "./structure";
import cors from "cors";
import { all } from "node_modules/axios";

export const app = express();
export const router = Router();

// Add body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

let noReq: number = 1;

// const clients: client[] = []; // Removed redeclaration

app.use(cors());
app.use("/api", router);

router.post("/location", (req, res) => {
  //console.log(req.body);
  const client: Client = req.body.client;
  client.id = noReq++; //should change this to a unique id
  //console.log(client);
  try {
    clients.addClient(client);
    res.json({
      id: client.id,
      message: "Client added successfully",
    });
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

router.get("/allClients", (req, res) => {
  try {
    const allClients = clients.getAllClients();
    const sanitizedClients = allClients.map(
      ({ blkList, chatable, ...client }) => client
    );
    res.json(sanitizedClients);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

router.get("/client/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const client = clients.getClient(id);
  if (client) {
    res.json(client);
  } else {
    res.status(404).json({ error: "Client not found" });
  }
});

router.get("/chatable", (req, res) => {
  const client = req.body.client;
  try {
    const chatable = clients.getChatableClients(client);
    console.log(chatable);
    res.json(chatable);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
    console.log(error);
  }
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
