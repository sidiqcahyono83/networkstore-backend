import { Hono } from "hono";
import { cors } from "hono/cors";

import productRoute from "./routes/product";
import userRoute from "./routes/user";
import registerRoute from "./routes/register";
import loginRoute from "./routes/login";
import meRoute from "./routes/me";
import pembayarantRoute from "./routes/pembayaran";
import areaRoute from "./routes/area";
import customersRoute from "./routes/customer";
import pppActiveRoute from "./routes/pppactive";

type Bindings = {
  TOKEN: string;
};

type Variables = {
  user: {
    id: string;
  };
};

export type HonoApp = { Bindings: Bindings; Variables: Variables };

const app = new Hono<HonoApp>();

app.use("*", cors());
app.get("/", (c) => {
  return c.json({
    message: "NetworkStore API",
    productsURL: "/customers",
    usersURL: "/users",
    cartURL: "/users/area/:areaName",
    customersUrl: "/customers",
  });
});

app.route("/users", userRoute);
app.route("/auth/register", registerRoute);
app.route("/auth/login", loginRoute);
app.route("/auth/me", meRoute);
app.route("/area", areaRoute);
app.route("/customers", customersRoute);
app.route("/pembayaran", pembayarantRoute);
app.route("/ppp", pppActiveRoute);

export default app;
