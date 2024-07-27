import { Hono } from "hono";
import prisma from "../lib/prisma";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { hashPassword, verifyPassword } from "../lib/password";
import { createToken } from "../lib/jwt";

export const app = new Hono();

type Bindings = {
	TOKEN: string;
};

type Variables = {
	user: {
		id: string;
	};
};

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

export default app;
