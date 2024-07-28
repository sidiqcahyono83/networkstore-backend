import { Hono } from "hono";
import prisma from "../lib/prisma";

export const app = new Hono();

app.get("/", async (c) => {
	try {
		const allShoppingCartItems = await prisma.shoppingCartItem.findMany({
			include: {
				cart: true,
			},
		});
		return c.json(
			{
				success: true,
				message: "List data ShoppingCartItems",
				data: allShoppingCartItems,
			},
			200
		);
	} catch (error) {
		console.error(`Error get movies : ${error}`);
	}
});

app.post("/", async (c) => {
	try {
		const body = await c.req.json();

		const newProduct = await prisma.product.create({
			data: {
				name: String(body.name),
				description: String(body.description),
				price: Number(body.price),
				stock: Number(body.stock),
				category: String(body.category),
				imageUrl: String(body.imageUrl),
				// ShoppingCartItem: {
				//   connectOrCreate: ShoppingCartItemData,
				// },
			},
		});

		return c.json(newProduct);
	} catch (error) {
		console.error(`Error get product : ${error}`);
	}
});

app.get("/:username", async (c) => {
	try {
		const id = c.req.param("id");
		const product = await prisma.product.findUnique({
			where: { id: id },
		});
		if (!product) {
			return c.json(
				{
					success: false,
					message: `product not found!`,
				},
				404
			);
		}
		return c.json({
			success: true,
			message: `Detail product ${product.name}`,
			data: product,
		});
	} catch (error) {
		console.error(`Error get product by id : ${error}`);
	}
});

app.delete("/:username", async (c) => {
	const id = c.req.param("id");
	const product = await prisma.product.delete({
		where: { id: id },
	});
	if (!id) {
		return c.json({ message: "products Not Found" });
	}
	return c.json(`product by name ${product.name} deleted`);
});

app.put("/:username", async (c) => {
	try {
		const id = c.req.param("id");
		const body = await c.req.json();
		if (!id) {
			return c.json({ message: `product not found`, Status: 404 });
		}
		const newProduct = await prisma.product.update({
			where: { id },
			data: {
				name: String(body.name),
				description: String(body.description),
				price: Number(body.price),
				stock: Number(body.stock),
				category: String(body.category),
				imageUrl: String(body.imageUrl),
			},
		});
		return c.json(newProduct);
	} catch (error) {
		console.error(`Error product : ${error}`);
	}
});

export default app;
