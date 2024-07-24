import { Hono } from "hono";
import { cors } from "hono/cors";
import productRoute from "./routes/product";
import userRoute from "./routes/user";
import cartRoute from "./routes/shopingcart";
import shoppingCartRoute from "./routes/shppingCartItem";

const app = new Hono();

app.use("*", cors());
app.get("/", (c) => {
	return c.json({
		message: "NetworkStore API",
		products_URL: "/products",
		users_URL: "/users",
		cart_URL: "/cart",
	});
});

app.route("/products", productRoute);
app.route("/users", userRoute);
app.route("/cart", cartRoute);
app.route("/cartitem", shoppingCartRoute);

const port = 3000;
console.log(`Rest api run in PORT: ${port}`);

export default app;
