const express = require("express");
const cors = require("cors");
const mysql = require("mysql2/promise");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());


// =========================
// DATABASE CONNECTION
// =========================

const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});


// =========================
// HOME
// =========================

app.get("/", (req, res) => {
  res.send("ShopNest Backend is Running 🚀");
});


// =========================
// DATABASE TEST
// =========================

app.get("/api/db-test", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT 1 AS test");

    res.json({
      message: "Database connected successfully",
      result: rows
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Database connection failed"
    });
  }
});


// =========================
// GET PRODUCTS
// =========================

app.get("/api/products", async (req, res) => {
  try {
    const [products] = await db.query(
      "SELECT * FROM products"
    );

    res.json(products);

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to load products"
    });
  }
});


// =========================
// SIGNUP
// =========================

app.post("/api/signup", async (req, res) => {
  try {
    const {
      name,
      email,
      password
    } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Please fill all fields"
      });
    }

    const [existingUser] = await db.query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );

    if (existingUser.length > 0) {
      return res.status(400).json({
        message: "Email already registered"
      });
    }

    const hashedPassword = await bcrypt.hash(
      password,
      10
    );

    await db.query(
      `INSERT INTO users
       (name, email, password)
       VALUES (?, ?, ?)`,
      [
        name,
        email,
        hashedPassword
      ]
    );

    res.json({
      message: "Account created successfully"
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Signup failed"
    });
  }
});


// =========================
// LOGIN
// =========================

app.post("/api/login", async (req, res) => {
  try {
    const {
      email,
      password
    } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Please enter email and password"
      });
    }

    const [users] = await db.query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );

    if (users.length === 0) {
      return res.status(401).json({
        message: "Invalid email or password"
      });
    }

    const user = users[0];

    const passwordMatch =
      await bcrypt.compare(
        password,
        user.password
      );

    if (!passwordMatch) {
      return res.status(401).json({
        message: "Invalid email or password"
      });
    }

    res.json({
      message: "Login successful",
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Login failed"
    });
  }
});


// =========================
// PLACE ORDER
// =========================

app.post("/api/orders", async (req, res) => {
  try {

    const {
      userId,
      customerName,
      customerAddress,
      customerPhone,
      total,
      items
    } = req.body;

    if (
      !userId ||
      !customerName ||
      !customerAddress ||
      !customerPhone ||
      !total ||
      !items
    ) {
      return res.status(400).json({
        message: "Please provide all order details"
      });
    }

    const [result] = await db.query(
      `INSERT INTO orders
       (
         user_id,
         customer_name,
         customer_address,
         customer_phone,
         total,
         status,
         items
       )
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        userId,
        customerName,
        customerAddress,
        customerPhone,
        total,
        "Placed",
        JSON.stringify(items)
      ]
    );

    res.json({
      message: "Order placed successfully",
      orderId: result.insertId
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Order placement failed"
    });
  }
});


// =========================
// GET USER ORDERS
// =========================

app.get("/api/orders/:userId", async (req, res) => {
  try {

    const { userId } = req.params;

    const [orders] = await db.query(
      `SELECT *
       FROM orders
       WHERE user_id = ?
       ORDER BY created_at DESC`,
      [userId]
    );

    const formattedOrders = orders.map(
      (order) => ({
        ...order,
        items:
          typeof order.items === "string"
            ? JSON.parse(order.items)
            : order.items
      })
    );

    res.json({
      orders: formattedOrders
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to load orders"
    });
  }
});


// =========================
// CANCEL ORDER
// =========================

app.put(
  "/api/orders/:orderId/cancel",
  async (req, res) => {

    try {

      const { orderId } = req.params;

      const [result] = await db.query(
        `UPDATE orders
         SET status = 'Cancelled'
         WHERE id = ?
         AND status NOT IN
         ('Delivered', 'Cancelled')`,
        [orderId]
      );

      if (result.affectedRows === 0) {

        return res.status(400).json({
          message:
            "This order cannot be cancelled"
        });

      }

      res.json({
        message:
          "Order cancelled successfully"
      });

    } catch (error) {

      console.error(error);

      res.status(500).json({
        message:
          "Failed to cancel order"
      });

    }

  }
);


// =========================
// EXCHANGE ORDER
// =========================

app.put(
  "/api/orders/:orderId/exchange",
  async (req, res) => {

    try {

      const { orderId } = req.params;

      const { reason } = req.body;


      // Check reason
      if (!reason) {

        return res.status(400).json({
          message:
            "Please select an exchange reason"
        });

      }


      // Update order status
      const [result] = await db.query(
        `UPDATE orders
         SET status = 'Exchange Requested'
         WHERE id = ?
         AND status NOT IN
         ('Cancelled', 'Exchange Requested')`,
        [orderId]
      );


      if (result.affectedRows === 0) {

        return res.status(400).json({
          message:
            "Exchange request cannot be submitted"
        });

      }


      res.json({

        message:
          "Exchange request submitted successfully",

        reason: reason

      });

    } catch (error) {

      console.error(error);

      res.status(500).json({
        message:
          "Failed to request exchange"
      });

    }

  }
);


// =========================
// START SERVER
// =========================

const PORT =
  process.env.PORT || 5000;

app.listen(PORT, () => {

  console.log(
    `ShopNest backend running on port ${PORT}`
  );

});