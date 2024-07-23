import { Hono } from "hono";
import prisma from "../lib/prisma";

export const app = new Hono();

app.get("/", async (c) => {
	try {
		const allShoppingCart = await prisma.shoppingCart.findMany();
		return c.json(
			{
				success: true,
				message: "List data ShopingCart",
				data: allShoppingCart,
			},
			200
		);
	} catch (error) {
		console.error(`Error get ShopingCart : ${error}`);
	}
});

app.get("/:id", async (c) => {
	try {
		const id = c.req.param("id");
		const ShoppingCart = await prisma.shoppingCart.findUnique({
			where: { id: id },
		});
		if (!ShoppingCart) {
			return c.json(
				{
					success: false,
					message: `ShopingCart not found!`,
				},
				404
			);
		}
		return c.json({
			success: true,
			message: `Detail ShopingCart ${ShoppingCart}`,
			data: ShoppingCart,
		});
	} catch (error) {
		console.error(`Error get ShopingCart by id : ${error}`);
	}
});

app.delete("/:id", async (c) => {
	const id = c.req.param("id");
	const ShoppingCart = await prisma.shoppingCart.delete({
		where: { id: id },
	});
	if (!id) {
		return c.json({ message: "users Not Found" });
	}
	return c.json(`ShoppingCart by name ${ShoppingCart} deleted`);
});

export default app;
