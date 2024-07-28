import { Hono } from "hono";
import prisma from "../lib/prisma";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";

export const app = new Hono();

app.get("/", async (c) => {
	try {
		const allShoppingCart = await prisma.shoppingCart.findMany({
			include: {
				items: {
					include: {
						product: true,
					},
				},
			},
		});

		const cartsWithTotalPrice = allShoppingCart.map((cart) => {
			const totalPrice = cart.items.reduce(
				(
					sum: number,
					item: { quantity: number; product: { price: number } }
				) => {
					return sum + item.quantity * item.product.price;
				},
				0
			);

			return {
				...cart,
				totalPrice,
			};
		});

		return c.json(
			{
				success: true,
				message: "List data ShoppingCart",
				data: cartsWithTotalPrice,
			},
			200
		);
	} catch (error) {
		console.error(`Error get ShoppingCart : ${error}`);
		return c.json(
			{
				success: false,
				message: "Error retrieving shopping cart data",
				error: (error as Error).message,
			},
			500
		);
	}
});

// app.post('/shoppingcart') async (c) => {
//   try {
//     const { userId } = await c.req.json()

//     const shoppingCart = await prisma.shoppingCart.create({
//       data: {
//         userId: userId || null,
//       },
//     })

//     return c.json({
//       message: 'ShoppingCart created successfully',
//       shoppingCart,
//     }, 201)
//   } catch (error) {
//     console.error(error)
//     return c.json({ error: 'Failed to create ShoppingCart' }, 500)
//   }
// })

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
