import { PrismaClient } from "@prisma/client";
import { customers } from "../src/data/User";

const prisma = new PrismaClient();

async function seed() {
  for (let customer of customers) {
    const newCustomerSeed = await prisma.customer.upsert({
      where: { id: customer.id },
      update: customer,
      create: customer,
    });
    console.log(`Customer : ${newCustomerSeed.id}`);
  }
}

seed()
  .catch((e) => {
    console.log(e);
    process.exit(1);
  })
  .finally(() => {
    prisma.$disconnect();
  });
