# Network Store Kebumen Backend

To install dependencies:

```sh
bun install
```

To run:

```sh
bun run dev
```

open <http://localhost:3000>

## ERD

![image](/images/prisma-erd.svg)

## Products:

| Endpoint      | HTTP   | Description          |
| ------------- | ------ | -------------------- |
| /products     | GET    | Get all products     |
| /products/:id | GET    | Get product by id    |
| /products     | POST   | Add new product      |
| /products     | DELETE | Delete all products  |
| /products/:id | DELETE | Delete product by id |
| /products/:id | PUT    | Update product by id |

## Auth:

| Endpoint         | HTTP   | Permission    |
| ---------------- | ------ | ------------- |
| /users           | GET    | Public        |
| /users/:username | GET    | Public        |
| /auth/register   | POST   | Public        |
| /auth/login      | POST   | Public        |
| /auth/me         | GET    | Authenticated |
| /auth/logout     | POST   | Authenticated |
| /cart            | GET    | Authenticated |
| /cart/items      | POST   | Authenticated |
| /cart/items/:id  | DELETE | Authenticated |
| /cart/items/:id  | PUT    | Authenticated |
