import { Hono } from "hono";
import prisma from "../lib/prisma";
export const app = new Hono();

//GET modem all
app.get("/", async (c) => {
  try {
    const allModem = await prisma.modem.findMany();
    return c.json(
      {
        success: true,
        message: "List data modem",
        data: allModem,
      },
      200
    );
  } catch (error) {
    console.error(`Error get movies : ${error}`);
  }
});

//POST modem
app.post("/", async (c) => {
  try {
    const body = await c.req.json();

    const newModem = await prisma.modem.create({
      data: {
        name: String(body.name),
        serial: String(body.serial),
      },
    });

    return c.json(newModem);
  } catch (error) {
    console.error(`Error get modem : ${error}`);
  }
});

//GET modem by ID
app.get("/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const modem = await prisma.modem.findUnique({
      where: { id: id },
      select: {
        id: true,
        name: true,
        serial: true,
      },
    });
    if (!modem) {
      return c.json(
        {
          success: false,
          message: `modem not found!`,
        },
        404
      );
    }
    return c.json({
      success: true,
      message: `Detail modem ${modem.name}`,
      data: modem,
    });
  } catch (error) {
    console.error(`Error get product by id : ${error}`);
  }
});

//DELETE modem
app.delete("/:id", async (c) => {
  const id = c.req.param("id");
  const modem = await prisma.modem.delete({
    where: { id: id },
  });
  if (!id) {
    return c.json({ message: "modem Not Found" });
  }
  return c.json(`modem ${modem.name} deleted`);
});

//PUT modem
app.put("/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const body = await c.req.json();
    if (!id) {
      return c.json({ message: `product not found`, Status: 404 });
    }
    const newModem = await prisma.modem.update({
      where: { id },
      data: {
        name: String(body.name),
        serial: String(body.serial),
        customer: {
          connect: {
            id: body.customerId,
          },
        },
        orderBy: {
          connect: {
            id: body.orderById,
          },
        },
      },
    });
    return c.json(newModem);
  } catch (error) {
    console.error(`Error modem : ${error}`);
  }
});

export default app;
