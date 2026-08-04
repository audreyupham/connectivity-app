import { prisma } from '../src/db.js';

async function main() {
  await prisma.user.create({
    data: {
      email: 'audrey@example.com',
      name: 'Audrey',
    },
  });
}

main().finally(() => prisma.$disconnect());

