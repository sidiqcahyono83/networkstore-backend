import { PrismaClient } from "@prisma/client";
import { products } from "../src/data/products";

const prisma = new PrismaClient();

async function seed() {
	for (let product of products) {
		const newProductSeed = await prisma.product.upsert({
			where: { name: product.name },
			update: product,
			create: product,
		});
		console.log(`Product : ${newProductSeed.name}`);
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
