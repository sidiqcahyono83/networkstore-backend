import { Hono } from "hono";
import prisma from "../lib/prisma";
export const app = new Hono();

//GET Customer All

app.get("/", async (c) => {
  try {
    const result = await prisma.customer.findMany({
      include: {
        paket: true,
        area: true,
        odp: true,
        modem: true,
      },
    });

    return c.json(
      {
        success: true,
        message: "List data Customers",
        data: result,
      },
      200
    );
  } catch (error) {
    console.error(`Error get movies : ${error}`);
  }
});

//GET CUSTOMER BY AREA

app.get("/:area", async (c) => {
  try {
    const userAreaId = c.req.param("area");
    const users = await prisma.customer.findMany({
      where: {
        area: {
          name: userAreaId,
        },
      },
      select: {
        id: true,
        username: true,
        fullname: true,
        address: true,
        phonenumber: true,
        ontName: true,
        redamanOlt: true,
        odp: true,
      },
    });

    if (users.length === 0) {
      return c.json(
        {
          success: false,
          message: `No users found in area: ${userAreaId}`,
        },
        404
      );
    }

    return c.json({
      success: true,
      message: `Customer in area ${userAreaId} sejumlah ${users.length}`,
      data: users,
    });
  } catch (error) {
    console.error(`Error getting users by area: ${error}`);
    return c.json(
      {
        success: false,
        message: "An error occurred while fetching users",
      },
      500
    );
  }
});

//GET CUSTOMER BY USER BY USERNAME

app.get("/user/:username", async (c) => {
  try {
    const areaUsername = c.req.param("username");

    const customersByUsername = await prisma.customer.findMany({
      where: {
        area: {
          user: {
            some: {
              username: areaUsername,
            },
          },
        },
      },
      select: {
        id: true,
        username: true,
        fullname: true,
        address: true,
        phonenumber: true,
        ontName: true,
        redamanOlt: true,
        paket: {
          select: {
            name: true,
            harga: true,
          },
        },
        diskon: true,
        area: {
          select: {
            name: true,
          },
        },
        odp: {
          select: {
            name: true,
          },
        },
        modem: {
          select: {
            name: true,
          },
        },
      },
    });

    if (customersByUsername.length === 0) {
      return c.json(
        {
          success: false,
          message: `No users found in area: ${customersByUsername.length}`,
        },
        404
      );
    }

    return c.json({
      success: true,
      message: `Customer in area ${areaUsername} sejumlah ${customersByUsername.length}`,
      data: customersByUsername,
    });
  } catch (error) {
    console.error(`Error getting users by area: ${error}`);
    return c.json(
      {
        success: false,
        message: "An error occurred while fetching users",
      },
      500
    );
  }
});

//GET CUSTOMER BY Q Seach

app.get("/q/:q", async (c) => {
  try {
    const q = c.req.param("q");
    const customers = await prisma.customer.findMany({
      where: {
        OR: [
          {
            username: {
              contains: q,
            },
          },
          {
            fullname: {
              contains: q,
            },
          },
          {
            address: {
              contains: q,
            },
          },
          {
            phonenumber: {
              contains: q,
            },
          },
        ],
      },
      select: {
        id: true,
        username: true,
        fullname: true,
        address: true,
        phonenumber: true,
        ontName: true,
        redamanOlt: true,
        paket: {
          select: {
            name: true,
            harga: true,
          },
        },
        diskon: true,
        area: {
          select: {
            name: true,
          },
        },
        odp: {
          select: {
            name: true,
          },
        },
        modem: {
          select: {
            name: true,
          },
        },
      },
    });

    if (customers.length === 0) {
      return c.json(
        {
          success: false,
          message: `No users found whit: ${customers.length}`,
        },
        404
      );
    }

    return c.json({
      success: true,
      message: `Customer in area ${q} sejumlah ${customers.length}`,
      data: customers,
    });
  } catch (error) {
    console.error(`Error getting users by area: ${error}`);
    return c.json(
      {
        success: false,
        message: "An error occurred while fetching users",
      },
      500
    );
  }
});

//CREATE CUSTOMER

app.post("/", async (c) => {
  try {
    const body = await c.req.json();
    const newCustomer = await prisma.customer.create({
      data: {
        username: String(body.username),
        fullname: String(body.fullname),
        address: String(body.address),
        phonenumber: String(body.phonenumber),
        ontName: String(body.ontName),
        redamanOlt: String(body.redamanOlt),
        diskon: Number(body.diskon),
        area: {
          connect: {
            id: String(body.area),
            name: String(body.area),
          },
        },
        odp: {
          connect: {
            id: String(body.odp),
            name: String(body.odp),
          },
        },
        modem: {
          connect: {
            id: String(body.modem),
            name: String(body.modem),
          },
        },
        paket: {
          connect: {
            id: String(body.paket),
            name: String(body.paket),
          },
        },
      },
    });
    return c.json(newCustomer);
  } catch (error) {
    console.error(`Error create customer : ${error}`);
    return c.json(
      {
        success: false,
        message: "An error occurred while creating customer",
      },
      500
    );
  }
});

//UPDATE CUSTOMER

app.put("/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const body = await c.req.json();
    if (!id) {
      return c.json({ message: `customer not found`, Status: 404 });
    }
    const updateCustomer = await prisma.customer.update({
      where: {
        id: String(id),
      },
      data: {
        username: String(body.username),
        fullname: String(body.fullname),
        address: String(body.address),
        phonenumber: String(body.phonenumber),
        ontName: String(body.ontName),
        redamanOlt: String(body.redamanOlt),
        diskon: Number(body.diskon),
        area: {
          connect: {
            id: String(body.area),
            name: String(body.area),
          },
        },
        odp: {
          connect: {
            id: String(body.odp),
            name: String(body.odp),
          },
        },
        modem: {
          connect: {
            id: String(body.modem),
            name: String(body.modem),
          },
        },
        paket: {
          connect: {
            id: String(body.paket),
            name: String(body.paket),
          },
        },
      },
    });
    return c.json(updateCustomer);
  } catch (error) {
    console.error(`Error update customer : ${error}`);
    return c.json(
      {
        success: false,
        message: "An error occurred while updating customer",
      },
      500
    );
  }
});

//DELETE CUSTOMER

app.delete("/:id", async (c) => {
  const id = c.req.param("id");
  const customer = await prisma.customer.delete({
    where: {
      id: String(id),
    },
  });
  return c.json(customer);
});

//SEARCH CUSTOMER
app.post("/search", async (c) => {
  try {
    const body = await c.req.json();
    const customers = await prisma.customer.findMany({
      where: {
        fullname: {
          contains: String(body.fullname),
        },
      },
      select: {
        id: true,
        username: true,
        fullname: true,
        address: true,
        phonenumber: true,
        ontName: true,
        redamanOlt: true,
        diskon: true,
        area: {
          select: {
            name: true,
          },
        },
        odp: {
          select: {
            name: true,
          },
        },
        modem: {
          select: {
            name: true,
          },
        },
        paket: {
          select: {
            name: true,
            harga: true,
          },
        },
      },
    });
    return c.json(customers);
  } catch (error) {
    console.error(`Error get movies : ${error}`);
    return c.json(
      {
        success: false,
        message: "An error occurred while fetching users",
      },
      500
    );
  }
});
export default app;
