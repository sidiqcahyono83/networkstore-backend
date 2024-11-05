import { Hono } from "hono";
import prisma from "../lib/prisma";
export const app = new Hono();

//GET odp all
app.get("/", async (c) => {
  try {
    const allOdp = await prisma.odp.findMany();
    return c.json(
      {
        success: true,
        message: "List data odp",
        data: allOdp,
      },
      200
    );
  } catch (error) {
    console.error(`Error get movies : ${error}`);
  }
});

//POST odp
app.post("/", async (c) => {
  try {
    const body = await c.req.json();

    const newOdp = await prisma.odp.create({
      data: {
        name: String(body.name),
        area: {
          connect: {
            id: body.areaId,
          },
        },
        rasio: String(body.rasio),
        pasiveSpliter: String(body.pasiveSpliter),
      },
    });

    return c.json(newOdp);
  } catch (error) {
    console.error(`Error get odp : ${error}`);
  }
});

//GET odp by ID
app.get("/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const odp = await prisma.odp.findUnique({
      where: { id: id },
      select: {
        id: true,
        name: true,
        rasio: true,
        pasiveSpliter: true,
        area: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
    if (!odp) {
      return c.json(
        {
          success: false,
          message: `odp not found!`,
        },
        404
      );
    }
    return c.json({
      success: true,
      message: `Detail odp ${odp.name}`,
      data: odp,
    });
  } catch (error) {
    console.error(`Error get product by id : ${error}`);
  }
});

//DELETE odp
app.delete("/:id", async (c) => {
  const id = c.req.param("id");
  const odp = await prisma.odp.delete({
    where: { id: id },
  });
  if (!id) {
    return c.json({ message: "odp Not Found" });
  }
  return c.json(`odp ${odp.name} deleted`);
});

//PUT odp
app.put("/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const body = await c.req.json();
    if (!id) {
      return c.json({ message: `product not found`, Status: 404 });
    }
    const newOdp = await prisma.odp.update({
      where: { id },
      data: {
        name: String(body.name),
        rasio: String(body.rasio),
        pasiveSpliter: String(body.pasiveSpliter),
        area: {
          connect: {
            id: body.areaId,
          },
        },
        customer: {
          connect: {
            id: body.customerId,
          },
        },
      },
    });
    return c.json(newOdp);
  } catch (error) {
    console.error(`Error odp : ${error}`);
  }
});

export default app;
