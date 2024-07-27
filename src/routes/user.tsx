import { Hono } from "hono";
import prisma from "../lib/prisma";

export const app = new Hono();

app.get("/", async (c) => {
	try {
		const allUser = await prisma.user.findMany();
		return c.json(
			{
				success: true,
				message: "List data user",
				data: allUser,
			},
			200
		);
	} catch (error) {
		console.error(`Error get User : ${error}`);
	}
});

app.post("/", async (c) => {
	try {
		const body = await c.req.json();

		const newUser = await prisma.user.create({
			data: {
				username: String(body.username),

				email: String(body.email),
			},
		});

		return c.json(newUser);
	} catch (error) {
		console.error(`Error get user : ${error}`);
	}
});

app.get("/:id", async (c) => {
	try {
		const id = c.req.param("id");
		const user = await prisma.user.findUnique({
			where: { id: id },
		});
		if (!user) {
			return c.json(
				{
					success: false,
					message: `user not found!`,
				},
				404
			);
		}
		return c.json({
			success: true,
			message: `Detail user ${user.username}`,
			data: user,
		});
	} catch (error) {
		console.error(`Error get user by id : ${error}`);
	}
});

app.delete("/:id", async (c) => {
	const id = c.req.param("id");
	const user = await prisma.user.delete({
		where: { id: id },
	});
	if (!id) {
		return c.json({ message: "users Not Found" });
	}
	return c.json(`user by name ${user.username} deleted`);
});

app.put("/:id", async (c) => {
	try {
		const id = c.req.param("id");
		const body = await c.req.json();
		if (!id) {
			return c.json({ message: `user not found`, Status: 404 });
		}
		const newUser = await prisma.user.update({
			where: { id },
			data: {
				username: String(body.username),
				email: String(body.email),
				firstName: String(body.firstName),
				lastName: String(body.lastName),
				address: String(body.address),
				phoneNumber: String(body.phoneNumber),
			},
		});
		return c.json(newUser);
	} catch (error) {
		console.error(`Error user : ${error}`);
	}
});

export default app;
