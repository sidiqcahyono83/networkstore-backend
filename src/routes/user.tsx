import { Hono } from "hono";
import prisma from "../lib/prisma";
import { hashPassword } from "../lib/password";
import { checkUserToken } from "../midleware/cekUserToken";

export const app = new Hono();

//GET User
app.get("/", async (c) => {
  try {
    const allUser = await prisma.user.findMany({
      select: {
        id: true,
        username: true,
        fullname: true,
        phoneNumber: true,
        address: true,
        Area: {
          select: {
            name: true,
          },
        },
      },
    });
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

//GET USER BY USERNAME
app.get("/:username", checkUserToken(), async (c) => {
  try {
    const username = c.req.param("username");
    const user = await prisma.user.findUnique({
      where: { username: username },
      select: {
        id: true,
        username: true,
        fullname: true,
        address: true,
        phoneNumber: true,
        Area: {
          select: {
            id: true,
            name: true,
            _count: {
              select: { customer: true },
            },
          },
        },
        _count: {
          select: { Area: true },
        },
      },
    });
    return c.json(user);
  } catch (error) {
    console.error(`Error get User : ${error}`);
  }
});

//GET User by Area
app.get("/area/:areaName", async (c) => {
  try {
    // Ambil nama area dari parameter permintaan
    const areaName = c.req.param("areaName");

    // Fetch users who belong to the specified area
    const users = await prisma.user.findMany({
      where: {
        Area: {
          some: {
            name: areaName, // Gunakan some untuk menyaring berdasarkan nama area
          },
        },
      },
      select: {
        id: true,
        username: true,
        fullname: true,
        phoneNumber: true,
        address: true,
      },
    });

    // Periksa jika pengguna ditemukan
    if (users.length === 0) {
      return c.json(
        {
          success: false,
          message: `No users found in area: ${areaName}`,
        },
        404
      );
    }

    // Kembalikan pengguna yang ditemukan
    return c.json({
      success: true,
      message: `Users in area: ${areaName}`,
      data: users,
    });
  } catch (error) {
    return c.json(
      {
        success: false,
        message: "An error occurred while fetching users",
      },
      500
    );
  }
});

//POST User
app.post("/", async (c) => {
  try {
    const body = await c.req.json();
    const newUser = await prisma.user.create({
      data: {
        username: String(body.username),
        fullname: String(body.fullname),
        address: String(body.address),
        password: {
          create: {
            hash: await hashPassword(body.password),
          },
        },
      },
    });
    return c.json(newUser);
  } catch (error) {
    console.error(`Error user : ${error}`);
  }
});

//DELETE User
app.delete("/:username", async (c) => {
  const id = c.req.param("id");
  const user = await prisma.user.delete({
    where: { id: id },
  });
  if (!id) {
    return c.json({ message: "users Not Found" });
  }
  return c.json(`user by name ${user.username} deleted`);
});

//PUT User
app.put("/:username", async (c) => {
  try {
    const username = c.req.param("username");
    const body = await c.req.json();
    if (!username) {
      return c.json({ message: `user not found`, Status: 404 });
    }
    const newUser = await prisma.user.update({
      where: { username },
      data: {
        username: String(body.username),
        fullname: String(body.fullname),
        address: String(body.address),
      },
    });
    return c.json(newUser);
  } catch (error) {
    console.error(`Error user : ${error}`);
  }
});

export default app;
