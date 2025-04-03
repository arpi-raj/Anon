"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clients = exports.ClientManager = void 0;
//singleton class
class ClientManager {
    constructor() {
        this.clients = [];
    }
    static getInstance() {
        if (!ClientManager.instance) {
            ClientManager.instance = new ClientManager();
        }
        return ClientManager.instance;
    }
    checkClientExists(clientId) {
        return this.clients.some((client) => client.id === clientId);
    }
    addClient(client) {
        // Initialize chatable array
        client.chatable = [];
        this.clients.push(client);
        // Update chatable lists for all clients when new client is added
        this.clients.forEach((client) => this.updatechatableLists(client));
        console.log("Client added:", client.userName, "with ID:", client.id);
    }
    removeClient(client) {
        // Remove client from all other clients' chatable lists
        this.clients.forEach((c) => {
            c.chatable = c.chatable.filter((ch) => ch !== client.id);
        });
        this.clients = this.clients.filter((c) => c.id !== client.id);
    }
    addBlock(client, block) {
        const c = this.clients.find((c) => c.id === client.id);
        if (c) {
            c.blkList.push(block.id);
            // Remove from chatable when blocked
            c.chatable = c.chatable.filter((ch) => ch !== block.id);
        }
    }
    removeBlock(client, block) {
        const c = this.clients.find((c) => c.id === client.id);
        if (c) {
            c.blkList = c.blkList.filter((b) => b !== block.id);
            // Recalculate chatable list after unblock
            this.updatechatableLists(c);
            this.updatechatableLists(block);
        }
    }
    addBlockFlag(client) {
        const c = this.clients.find((c) => c.id === client.id);
        if (c) {
            c.blkFlag = c.blkFlag + 1;
            // If block flag reaches threshold, remove from all chatable lists
            if (c.blkFlag >= 3) {
                this.clients.forEach((otherClient) => {
                    otherClient.chatable = otherClient.chatable.filter((ch) => ch !== c.id);
                });
            }
        }
    }
    calculateDistance(client1, client2) {
        const R = 6371e3; // Earth's radius in meters
        const φ1 = (client1.coords.lat * Math.PI) / 180;
        const φ2 = (client2.coords.lat * Math.PI) / 180;
        const Δφ = ((client2.coords.lat - client1.coords.lat) * Math.PI) / 180;
        const Δλ = ((client2.coords.long - client1.coords.long) * Math.PI) / 180;
        const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
            Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c; // Distance in meters
    }
    updatechatableLists(client) {
        const nearbyClients = this.clients.filter((otherClient) => {
            // Skip if it's the same client
            if (otherClient.id === client.id)
                return false;
            // Skip if client is in block list
            if (client.blkList.some((b) => b === otherClient.id))
                return false;
            if (otherClient.blkList.some((b) => b === client.id))
                return false;
            // Skip if client has too many block flags
            if (otherClient.blkFlag >= 3)
                return false;
            // Calculate distance
            const distance = this.calculateDistance(client, otherClient);
            // Check if within both clients' preferred radiuses
            return (distance <= client.prefRadius && distance <= otherClient.prefRadius);
        });
        // Update chatable list
        client.chatable = nearbyClients.map((c) => c.id);
    }
    //sending wihtout the chatable and block list
    getAllClients() {
        return this.clients;
    }
    getClient(id) {
        return this.clients.find((c) => c.id === id);
    }
    getNearbyClientsWithDistance(client) {
        if (!client || !this.clients.includes(client)) {
            return [];
        }
        // Update chatable list first
        this.updatechatableLists(client);
        // Return chatable clients with distances
        return client.chatable
            .map((id) => {
            const c = this.clients.find((c) => c.id === id);
            if (c) {
                return {
                    id: c.id,
                    distance: this.calculateDistance(client, c),
                };
            }
            return undefined;
        })
            .filter((c) => c !== undefined);
    }
    // Update client location
    updateClientLocation(client, newCoords) {
        const c = this.clients.find((c) => c.id === client.id);
        if (c) {
            c.coords = newCoords;
            // Update chatable lists for all clients when location changes
            this.clients.forEach((client) => this.updatechatableLists(client));
        }
    }
    // Update client preferred radius
    updatePreferredRadius(client, newRadius) {
        const c = this.clients.find((c) => c.id === client.id);
        if (c) {
            c.prefRadius = newRadius;
            // Update chatable lists for all clients when radius changes
            this.clients.forEach((client) => this.updatechatableLists(client));
        }
    }
    // Get chatable clients
    //*"error": "Converting circular structure to JSON\n    --> starting at object with constructor 'Array'\n    |     index 0 -> object with constructor 'Object'\n    |     property 'chatable' -> object with constructor 'Array'\n    |     index 0 -> object with constructor 'Object'\n    --- property 'chatable' clos
    // gpt and co-pilot fix dunno --update got it/
    //only return the id, prefRadius, coords, blkList, chatable, blkFlag
    //not fixes yet
    getChatableClients(id) {
        const findClient = this.clients.find((c) => c.id === id);
        if (!findClient)
            return "Client not found";
        //console.log("Chatable IDs:", findClient.chatable);
        return findClient.chatable
            .map((id) => {
            const c = this.clients.find((c) => c.id === id);
            if (c) {
                //console.log("Found user:", c.userName, "with ID:", c.id);
                return { userName: c.userName, id: c.id };
            }
        })
            .filter(Boolean);
    }
}
exports.ClientManager = ClientManager;
exports.clients = ClientManager.getInstance();
