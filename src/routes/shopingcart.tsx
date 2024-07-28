import { Hono } from "hono";
import prisma from "../lib/prisma";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { checkUserToken } from "../midleware/cekUserToken";

export const app = new Hono();

app.get("/shoppingCart", checkUserToken(), async (c) => {
	const user = c.get("user");

	const existingCart = await prisma.shoppingCart.findFirst({
		where: { userId: user.id },
		orderBy: { createdAt: "desc" },
		include: { items: { include: { product: true } } },
	});

	if (!existingCart) {
		const newCart = await prisma.shoppingCart.create({
			data: { userId: user.id },
			include: { items: { include: { product: true } } },
		});

		return c.json({
			message: "Shopping shoppingCart data",
			shoppingCart: newCart,
		});
	}

	return c.json({
		message: "Shopping shoppingCart data",
		shoppingCart: existingCart,
	});
});

app.post(
	"/shoppingCart/items",
	checkUserToken(),
	zValidator(
		"json",
		z.object({
			productId: z.string(),
			quantity: z.number().min(1),
		})
	),
	async (c) => {
		const user = c.get("user");
		const body = c.req.valid("json");

		const existingCart = await prisma.shoppingCart.findFirst({
			where: { userId: user.id },
			orderBy: { createdAt: "desc" },
		});

		if (!existingCart) {
			c.status(404);
			return c.json({ message: "Shopping shoppingCart is unavailable" });
		}

		// FIXME: check existing product item before proceeding

		const updatedCart = await prisma.shoppingCart.update({
			where: { id: existingCart.id },
			data: {
				items: {
					create: {
						productId: body.productId,
						quantity: body.quantity,
					},
				},
			},
			include: {
				items: true,
			},
		});

		return c.json({
			message: "Product added to the shoppingCart",
			shoppingCart: updatedCart,
		});
	}
);

export default app;
