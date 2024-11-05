import { Hono } from "hono";
import prisma from "../lib/prisma";
import { HonoApp } from "../index";
import { checkUserToken } from "../midleware/cekUserToken";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";

const app = new Hono<HonoApp>();

// CREATE PEMBAYARAN
app.post(
  "/",
  zValidator(
    "json",
    z.object({
      customerId: z.string(),
      metode: z.string(),
    })
  ),
  checkUserToken(),
  async (c) => {
    const user = c.get("user");
    const body = c.req.valid("json");

    if (!user) return c.json({ message: "User Not Login" });

    const customer = await prisma.customer.findUnique({
      where: { id: body.customerId },
      include: { paket: true },
    });

    if (!customer) return c.json({ message: "Customer Not Found" });

    const now = new Date();
    const currentYear = now.getFullYear(); // Mengambil tahun saat ini
    const currentMonth = now.getMonth() + 1; // Mengambil bulan saat ini (0-11)

    // Set ke awal bulan untuk mencari periode pembayaran
    const startOfMonth = new Date(currentYear, currentMonth - 1, 1); // Bulan dikurangi 1 karena bulan dimulai dari 0
    const endOfMonth = new Date(currentYear, currentMonth, 1); // Mendapatkan hari terakhir bulan ini

    // Cari pembayaran yang sudah ada di bulan ini untuk customer yang sama
    const existingPembayaran = await prisma.pembayaran.findFirst({
      where: {
        customerId: body.customerId,
        periode: {
          gte: startOfMonth,
          lte: endOfMonth,
        },
      },
    });

    if (existingPembayaran) {
      return c.json({
        message: "Pembayaran sudah ada untuk periode bulan ini",
      });
    }

    // Menghitung total bayar
    const totalBayar = (customer.paket?.harga || 0) - customer.diskon;

    // Membuat pembayaran baru
    const newPembayaran = await prisma.pembayaran.create({
      data: {
        periode: now.toISOString(),
        metode: body.metode,
        totalBayar,
        customer: { connect: { id: body.customerId } },
        user: { connect: { id: user.id } },
      },
    });

    return c.json(newPembayaran);
  }
);

// GET PEMBAYARAN
app.get("/", checkUserToken(), async (c) => {
  const user = c.get("user");
  if (!user) return c.json({ message: "User Not Login" });
  const pembayaran = await prisma.pembayaran.findMany({
    where: { userId: user.id },
    include: {
      customer: true,
      user: {
        select: { username: true },
      },
    },
  });
  return c.json(pembayaran);
});

//GET PEMBAYARAN BY ID
app.get("/:id", checkUserToken(), async (c) => {
  const user = c.get("user");
  if (!user) return c.json({ message: "User Not Login" }, 401);

  const id = c.req.param("id");

  if (!id) {
    return c.json({ message: "ID not found" }, 400);
  }

  const pembayaran = await prisma.pembayaran.findUnique({
    where: { id: id },
    include: {
      customer: true,
      user: {
        select: { username: true },
      },
    },
  });

  if (!pembayaran) {
    return c.json({ message: "Pembayaran not found" }, 404);
  }

  return c.json(pembayaran);
});

// DELETE PEMBAYARAN
app.delete(
  "/:id",

  checkUserToken(),
  async (c) => {
    const user = c.get("user");
    if (!user) return c.json({ message: "User Not Login" });
    const id = c.req.param("id");
    const deletedPembayaran = await prisma.pembayaran.delete({
      where: { id: id },
    });
    return c.json(deletedPembayaran);
  }
);

// PUT PEMBAYARAN
app.put(
  "/:id",
  zValidator(
    "json",
    z.object({
      id: z.string(),
      customerId: z.string(),
      metode: z.string(),
    })
  ),
  checkUserToken(),
  async (c) => {
    const user = c.get("user");
    if (!user) return c.json({ message: "User Not Login" });
    const body = c.req.valid("json");

    // Dapatkan tanggal sekarang dan set ke awal bulan
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const customer = await prisma.customer.findUnique({
      where: { id: body.customerId },
      include: { paket: true },
    });

    if (!customer) return c.json({ message: "Customer Not Found" });

    // Menghitung total bayar
    const totalBayar = (customer.paket?.harga || 0) - customer.diskon;

    const updatedPembayaran = await prisma.pembayaran.update({
      where: { id: body.id },
      data: {
        periode: startOfMonth,
        metode: body.metode,
        totalBayar,
        customer: { connect: { id: body.customerId } },
        user: { connect: { id: user.id } },
      },
    });
    return c.json(updatedPembayaran);
  }
);

export default app;
