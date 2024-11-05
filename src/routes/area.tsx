import { Hono } from "hono";
import prisma from "../lib/prisma";
export const app = new Hono();

app.get("/", async (c) => {
  try {
    const allArea = await prisma.area.findMany();
    return c.json(
      {
        success: true,
        message: "List data Area",
        data: allArea,
      },
      200
    );
  } catch (error) {
    console.error(`Error get movies : ${error}`);
  }
});

app.post("/", async (c) => {
  try {
    const body = await c.req.json();

    const newArea = await prisma.area.create({
      data: {
        name: String(body.name),
      },
    });

    return c.json(newArea);
  } catch (error) {
    console.error(`Error get area : ${error}`);
  }
});

app.get("/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const area = await prisma.area.findUnique({
      where: { id: id },
      include: {
        user: {
          select: {
            username: true,
          },
        },
      },
    });
    if (!area) {
      return c.json(
        {
          success: false,
          message: `Area not found!`,
        },
        404
      );
    }
    return c.json({
      success: true,
      message: `Detail Area ${area.name}`,
      data: area,
    });
  } catch (error) {
    console.error(`Error get product by id : ${error}`);
  }
});

app.delete("/:id", async (c) => {
  const id = c.req.param("id");
  const area = await prisma.area.delete({
    where: { id: id },
  });
  if (!id) {
    return c.json({ message: "Area Not Found" });
  }
  return c.json(`Area ${area.name} deleted`);
});

app.put("/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const body = await c.req.json();
    if (!id) {
      return c.json({ message: `product not found`, Status: 404 });
    }
    const newArea = await prisma.area.update({
      where: { id },
      data: {
        name: String(body.name),
      },
    });
    return c.json(newArea);
  } catch (error) {
    console.error(`Error Area : ${error}`);
  }
});

export default app;
