interface Coords {
  lat: number;
  long: number;
}

export interface Client {
  id: number;
  prefRadius: number;
  coords: Coords;
  blkList: Client[];
  chatable: Client[];
  blkFlag: number;
}

class ClientManager {
  private clients: Client[];
  private static instance: ClientManager;

  private constructor() {
    this.clients = [];
  }

  static getInstance(): ClientManager {
    if (!this.instance) {
      this.instance = new ClientManager();
    }
    return this.instance;
  }

  addClient(client: Client): void {
    // Initialize chatable array
    client.chatable = [];
    this.clients.push(client);
    // Update chatable lists for all clients when new client is added
    this.clients.forEach((client) => this.updatechatableLists(client));

  }

  removeClient(client: Client): void {
    // Remove client from all other clients' chatable lists
    this.clients.forEach((c) => {
      c.chatable = c.chatable.filter((ch) => ch.id !== client.id);
    });
    this.clients = this.clients.filter((c) => c.id !== client.id);
  }

  addBlock(client: Client, block: Client): void {
    const c = this.clients.find((c) => c.id === client.id);
    if (c) {
      c.blkList.push(block);
      // Remove from chatable when blocked
      c.chatable = c.chatable.filter((ch) => ch.id !== block.id);
      block.chatable = block.chatable.filter((ch) => ch.id !== client.id);
    }
  }

  removeBlock(client: Client, block: Client): void {
    const c = this.clients.find((c) => c.id === client.id);
    if (c) {
      c.blkList = c.blkList.filter((b) => b.id !== block.id);
      // Recalculate chatable list after unblock
      this.updatechatableLists(c);
      this.updatechatableLists(block);
    }
  }

  addChat(client: Client, chat: Client): void {
    const c = this.clients.find((c) => c.id === client.id);
    if (c) {
      c.chatable.push(chat);
    }
  }

  addBlockFlag(client: Client): void {
    const c = this.clients.find((c) => c.id === client.id);
    if (c) {
      c.blkFlag = c.blkFlag + 1;
      // If block flag reaches threshold, remove from all chatable lists
      if (c.blkFlag >= 3) {
        this.clients.forEach((otherClient) => {
          otherClient.chatable = otherClient.chatable.filter(
            (ch) => ch.id !== c.id
          );
        });
      }
    }
  }

  private calculateDistance(client1: Client, client2: Client): number {
    const R = 6371000;
    const φ1 = (client1.coords.lat * Math.PI) / 180;
    const φ2 = (client2.coords.lat * Math.PI) / 180;
    const Δφ = ((client2.coords.lat - client1.coords.lat) * Math.PI) / 180;
    const Δλ = ((client2.coords.long - client1.coords.long) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);

    return 2 * R * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  }

  updatechatableLists(client: Client): void {
    const nearbyClients = this.clients.filter((otherClient) => {
      // Skip if it's the same client
      if (otherClient.id === client.id) return false;

      // Skip if client is in block list
      if (client.blkList.some((b) => b.id === otherClient.id)) return false;
      if (otherClient.blkList.some((b) => b.id === client.id)) return false;

      // Skip if client has too many block flags
      if (otherClient.blkFlag >= 3) return false;

      // Calculate distance
      const distance = this.calculateDistance(client, otherClient);

      // Check if within both clients' preferred radiuses
      return (
        distance <= client.prefRadius && distance <= otherClient.prefRadius
      );
    });

    // Update chatable list
    client.chatable = nearbyClients;
  }

  getAllClients(): Client[] {
    return this.clients;
  }

  getClient(id: number): Client | undefined {
    return this.clients.find((c) => c.id === id);
  }

  getNearbyClientsWithDistance(
    client: Client
  ): Array<{ client: Client; distance: number }> {
    if (!client || !this.clients.includes(client)) {
      return [];
    }

    // Update chatable list first
    this.updatechatableLists(client);

    // Return chatable clients with distances
    return client.chatable
      .map((otherClient) => ({
        client: otherClient,
        distance: this.calculateDistance(client, otherClient),
      }))
      .sort((a, b) => a.distance - b.distance);
  }

  // Update client location
  updateClientLocation(client: Client, newCoords: Coords): void {
    const c = this.clients.find((c) => c.id === client.id);
    if (c) {
      c.coords = newCoords;
      // Update chatable lists for all clients when location changes
      this.clients.forEach((client) => this.updatechatableLists(client));
    }
  }

  // Update client preferred radius
  updatePreferredRadius(client: Client, newRadius: number): void {
    const c = this.clients.find((c) => c.id === client.id);
    if (c) {
      c.prefRadius = newRadius;
      // Update chatable lists for all clients when radius changes
      this.clients.forEach((client) => this.updatechatableLists(client));
    }
  }

  // Get chatable clients
  getchatableClients(client: Client): Client[] {
    const c = this.clients.find((c) => c.id === client.id);
    return c ? c.chatable : [];
  }
}

export const clients = ClientManager.getInstance();

const client1 = {
  id: 0,
  prefRadius: 1000,
  coords: { lat: 30.990, long: 72.990 },
  blkList: [],
  chatable: [],
  blkFlag: 0,
};

const client2 = {
  id: 1,
  prefRadius: 1000,
  coords: { lat: 32.990, long: 72.990 },
  blkList: [],
  chatable: [],
  blkFlag: 0,
};

clients.addClient(client1);
clients.addClient(client2);

export const test = () => {
  console.log(clients.getNearbyClientsWithDistance(client1));
  console.log(clients.getNearbyClientsWithDistance(client2));
};