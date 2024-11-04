import { Hono } from "hono";
import { cors } from "hono/cors";

import productRoute from "./routes/product";
import userRoute from "./routes/user";
import registerRoute from "./routes/register";
import loginRoute from "./routes/login";
import meRoute from "./routes/me";
import cartRoute from "./routes/cart";
import areaRoute from "./routes/area";

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
    productsURL: "/products",
    usersURL: "/users",
    cartURL: "/cart",
  });
});

app.route("/products", productRoute);
app.route("/users", userRoute);
app.route("/auth/register", registerRoute);
app.route("/auth/login", loginRoute);
app.route("/auth/me", meRoute);
app.route("/cart", cartRoute);
app.route("/area", areaRoute);

export default app;
