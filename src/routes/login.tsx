import { Hono } from "hono";
import prisma from "../lib/prisma";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { verifyPassword } from "../lib/password";
import { createToken } from "../lib/jwt";
import { checkUserToken } from "../midleware/cekUserToken";

export const app = new Hono();

app.post(
	"/auth",
	zValidator(
		"json",
		z.object({
			username: z.string(),
			password: z.string(),
		})
	),
	async (c) => {
		const body = c.req.valid("json");

		const foundUser = await prisma.user.findUnique({
			where: { username: body.username },
			include: { password: { select: { hash: true } } },
		});

		if (!foundUser) {
			c.status(404);
			return c.json({ message: "Cannot login because user not found" });
		}

		if (!foundUser?.password?.hash) {
			c.status(400);
			return c.json({
				message: "Cannot login because user doesn't have a password",
			});
		}

		const validPassword = await verifyPassword(
			foundUser.password.hash,
			body.password
		);

		if (!validPassword) {
			c.status(400);
			return c.json({
				message: "Password incorrect",
			});
		}

		const token = await createToken(foundUser.id);

		if (!token) {
			c.status(400);
			return c.json({ message: "Token failed to create" });
		}

		return c.json({
			message: "Login successful",
			token,
		});
	}
);

app.get("/auth/me", checkUserToken(), async (c) => {
	const userData = await prisma.user.findUnique({
		where: { id: user.id },
	});

	return c.json({
		message: "User data",
		user: userData,
	});
});

app.get("/auth/logout", checkUserToken(), async (c) => {
	// Note: might be unnecessary since this is token-based auth
	// We can just remove the token on the client or frontend
	return c.json({
		message: "Logout",
	});
});

// app.get("/cart", checkUserToken(), async (c) => {
// 	const user = c.get("user");

// 	const existingCart = await prisma.shoppingCart.findFirst({
// 		where: { userId: user.id },
// 		orderBy: { createdAt: "desc" },
// 		include: { items: { include: { product: true } } },
// 	});

// 	if (!existingCart) {
// 		const newCart = await prisma.shoppingCart.create({
// 			data: { userId: user.id },
// 			include: { items: { include: { product: true } } },
// 		});

// 		return c.json({
// 			message: "Shopping cart data",
// 			cart: newCart,
// 		});
// 	}

// 	return c.json({
// 		message: "Shopping cart data",
// 		cart: existingCart,
// 	});
// });

export default app;
