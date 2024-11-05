import { Hono } from "hono";

import prisma from "../lib/prisma";
import { checkUserToken } from "../midleware/cekUserToken";
import { HonoApp } from "../index";

const app = new Hono<HonoApp>();

app.get("/", checkUserToken(), async (c, next) => {
  const user = c.get("user");

  const userData = await prisma.user.findUnique({
    where: { id: user.id },
    select: {
      id: true,
      username: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return c.json({
    message: "User data",
    user: userData,
  });
});

export default app;
