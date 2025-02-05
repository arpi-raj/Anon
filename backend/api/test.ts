import { ClientManager, Client } from "./structure";
import axios from "axios";

const clients = ClientManager.getInstance();

// Populate with 50 clients
for (let i = 0; i < 50; i++) {
  clients.addClient({
    id: i,
    chatable: [],
    blkList: [],
    blkFlag: 0,
    prefRadius: 10000, // Set a reasonable radius
    coords: { lat: Math.random() * 100, long: Math.random() * 100 },
  });
}

// Send location updates every 5 seconds
let clientIndex = 0; // Tracks the current batch start index

//kinda like pageation
setInterval(() => {
  const allClients = clients.getAllClients();

  if (allClients.length === 0) {
    console.warn("No clients available to send.");
    return;
  }

  // Get the next batch of 10 clients
  const batch = allClients.slice(clientIndex, clientIndex + 10);

  // Send requests for the batch
  batch.forEach((client) => {
    console.log(`Sending location for client ${client.id}...`);
    axios
      .post("http://localhost:3000/api/location", { client })
      .catch((err) =>
        console.error(`Error sending for client ${client.id}:`, err.message)
      );
  });

  // Move to the next batch
  clientIndex += 10;

  // If we reach the end, reset to the beginning
  if (clientIndex >= allClients.length) {
    clientIndex = 0;
  }
}, 10000); // Runs every 10 seconds
