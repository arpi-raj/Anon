import express from "express";
import { Router } from "express";
import cors from "cors";

const app = express();
const router = Router();

interface client {
  prefRadius: number;
  latitude: number;
  longitude: number;
}

// Add body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

function toRadians(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

let noReq: number = 1;

function calculateDistance(
  latitude1: number,
  longitude1: number,
  latitude2: number,
  longitude2: number
): number {
  const R = 6371000; // Radius of the Earth in meters
  const dLat = toRadians(latitude2 - latitude1);
  const dLon = toRadians(longitude2 - longitude1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(latitude1)) *
      Math.cos(toRadians(latitude2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // Distance in meters
}

const clients: client[] = [];

app.use(cors());
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
    const distance = calculateDistance(
      client.latitude,
      client.longitude,
      parseFloat(latitude as string),
      parseFloat(longitude as string)
    );
    console.log(distance);
    return (
      distance <= parseFloat(prefRadius as string) &&
      distance <= client.prefRadius
    );
  });

  res.json(clientsWithinRadius);
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
