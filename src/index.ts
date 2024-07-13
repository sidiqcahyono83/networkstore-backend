import { Hono } from "hono";
import productRoute from "./routes/product";

const app = new Hono();

app.route("/product", productRoute);

const port = 3000;
console.log(`Rest genres run in PORT: ${port}`);

export default app;
