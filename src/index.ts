import { Hono } from "hono";
import productRoute from "./routes/product";

const app = new Hono();

app.get("/", (c) => {
  return c.json({
    message: "NetworkStore API",
    URL: "/product",
  });
});

app.route("/product", productRoute);

const port = 3000;
console.log(`Rest genres run in PORT: ${port}`);

export default app;
