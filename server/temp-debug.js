// temp-debug.js
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

(async () => {
  try {
    console.log("Prisma client keys:", Object.keys(prisma).sort());
  } catch (err) {
    console.error("temp-debug error:", err);
  } finally {
    await prisma.$disconnect();
  }
})();
