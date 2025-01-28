import { PrismaClient } from "@prisma/client";
import express from "express";
import cors from "cors";

const app = express();
const prisma = new PrismaClient();

app.use(express.json());
app.use(cors());

app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});

app.post("/location", (req, res) => {
  console.log(req.body);
  const { latitude, longitude } = req.body;
  console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);
  res.send("Location received");
});

app.post("/signup", async (req, res) => {
  const { email, password, name } = req.body;

  try {
    // Attempt to create the user
    const result = await prisma.user.create({
      data: {
        name,
        email,
        password,
      },
    });

    if (result) {
      console.log(result);
      console.log("User created successfully");
      // You can send a success response if user creation is successful
      res.status(201).send("User created successfully");
    }
  } catch (error) {
    // Catch any errors that occur during the database operation
    console.error("Error creating user:", error);

    // Send an error response to the client
    res.status(500).send("An error occurred while creating the user");
  }
});

app.post("/signin", (req, res) => {
  res.send("Signin route");
});

export default app;
