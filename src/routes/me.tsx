import { Hono } from "hono";


import { checkUserToken } from "../midleware/cekUserToken";
import { HonoApp } from "../index";
import prisma from "../lib/prisma";

const app = new Hono<HonoApp>();

//GET User
app.get("/", checkUserToken(), async (c, next) => {
  const user = c.get("user");

  
  const userData = await prisma.customer.findUnique({
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
