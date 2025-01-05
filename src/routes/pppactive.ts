import { Hono } from "hono";
export const app = new Hono();

const urlphp = process.env.PHP_API;
const apiphp = "http://192.168.4.5";

app.get("/active", async (c) => {
  try {
    // const result = await fetch(`${urlphp}/pppactive.php`);
    const apiphp = "http://192.168.4.5";
    const result = await fetch(`${apiphp}/pppactive.php`);

    if (!result.ok) {
      throw new Error(`Error! status: ${result.status}`);
    }

    const data = await result.json();

    // Mengembalikan data sebagai JSON response dari Hono
    return c.json(data);
  } catch (error) {
    console.error(`Error fetching data: ${error}`);

    // Mengembalikan respons error jika terjadi kesalahan
    return c.json({ message: `Error fetching data` }, 500);
  }
});

app.get("/secret", async (c) => {
  try {
    const result = await fetch(`${apiphp}/pppSecret.php`);

    if (!result.ok) {
      throw new Error(`Error! status: ${result.status}`);
    }

    const data = await result.json();

    // Mengembalikan data sebagai JSON response dari Hono
    return c.json(data);
  } catch (error) {
    console.error(`Error fetching data: ${error}`);

    // Mengembalikan respons error jika terjadi kesalahan
    return c.json({ message: `Error fetching data` }, 500);
  }
});

app.get("/nonactive", async (c) => {
  try {
    const result = await fetch(`${apiphp}/nonactive.php`);

    if (!result.ok) {
      throw new Error(`Error! status: ${result.status}`);
    }

    const data = await result.json();

    // Mengembalikan data sebagai JSON response dari Hono
    return c.json(data);
  } catch (error) {
    console.error(`Error fetching data: ${error}`);

    // Mengembalikan respons error jika terjadi kesalahan
    return c.json({ message: `Error fetching data` }, 500);
  }
});

interface User {
  username: string;
  password: string;
  profile: string;
}

// Endpoint untuk membuat PPPoE user
app.post("/createppp", async (c) => {
  try {
    const { username, password, profile } = await c.req.json();

    // Cek apakah data yang diperlukan ada
    if (!username || !password || !profile) {
      return c.json({ message: "Missing required fields" }, 400);
    }

    // Kirim request untuk membuat user baru
    const createResult = await fetch(`${apiphp}/creatpppoe.php`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password, profile }),
    });

    const data = await createResult.json();

    // Cek status hasil pembuatan user
    if (createResult.ok) {
      return c.json(data, 200); // Berhasil membuat user
    } else {
      return c.json({ message: "Error creating PPPoE user" }, 500);
    }
  } catch (error) {
    console.error(`Error creating PPPoE: ${error}`);
    return c.json({ message: "Error creating PPPoE" }, 500);
  }
});

// Endpoint untuk menonaktifkan PPPoE user
app.post("/disableppp", async (c) => {
  try {
    const { username } = await c.req.json();

    // Cek apakah username ada dalam request
    if (!username) {
      return c.json({ message: "Username is required" }, 400);
    }

    // Kirim request ke PHP API untuk menonaktifkan user
    const result = await fetch(`${apiphp}/disablepppoe.php/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username }),
    });

    // Periksa apakah respons dari PHP API valid
    if (!result.ok) {
      return c.json({ message: "Error disabling PPPoE user" }, 500);
    }

    const data = await result.json();

    // Periksa apakah data dari PHP API memiliki properti message
    if (data && data.message) {
      return c.json(data, 200); // Jika ada message, kembalikan respons
    } else {
      // Jika tidak ada message dalam respons, beri pesan error default
      return c.json({ message: "Unexpected error occurred" }, 500);
    }
  } catch (error) {
    console.error(`Error disabling PPPoE: ${error}`);
    return c.json({ message: "Error disabling PPPoE" }, 500);
  }
});

export default app;
