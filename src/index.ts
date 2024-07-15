import { Hono } from "hono";
import { cors } from "hono/cors";
import productRoute from "./routes/product";

const app = new Hono();

app.use("/*", cors());
app.get("/", (c) => {
  return c.json({
    message: "NetworkStore API",
    URL: "/products",
  });
});

app.route("/products", productRoute);

const port = 3000;
console.log(`Rest genres run in PORT: ${port}`);

export default app;
