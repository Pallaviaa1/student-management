require("dotenv").config();
const express = require("express");
const cors = require("cors");
const studentRoutes = require("./routes/studentRoutes");
const { PrismaClient } = require("@prisma/client");

const app = express();
const prisma = new PrismaClient();

// Handle database connection
prisma.$connect()
  .then(() => console.log("Database connected successfully!"))
  .catch((error) => {
    console.error("Database connection failed:", error.message);
    process.exit(1); // Stop the server if the database connection fails
  });

app.use(cors());
app.use(express.json());

app.use("/api/students", studentRoutes);

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Graceful shutdown for Prisma
process.on("SIGINT", async () => {
  console.log("Closing database connection...");
  await prisma.$disconnect();
  console.log("Database disconnected. Server shutting down.");
  process.exit(0);
});
