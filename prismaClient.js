const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

prisma.$connect()
  .then(() => console.log("Database connected successfully!"))
  .catch((error) => {
    console.error("Database connection failed:", error.message);
    process.exit(1); // Exit if connection fails
  });

process.on("SIGINT", async () => {
  console.log("Closing database connection...");
  await prisma.$disconnect();
  console.log("Database disconnected. Server shutting down.");
  process.exit(0);
});

module.exports = prisma;
