"use client";
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { connectMongoDB } = require("./database/Mongoose");
const { connectMySql, mysqlPool } = require("./database/MySql");
const userRouter = require("./router/user");
require("dotenv").config();

// Connect to databases
connectMongoDB();
connectMySql();
const app = express();
app.use(cookieParser());
app.use(express.json());

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true, // Allow cookies
  })
);
app.use(express.raw({ type: "application/json" }));

app.use(userRouter);
app.get("/menu", async (req, res) => {
  try {
    const query = `
SELECT m.menu_item_id, m.name, m.description, m.price AS original_price, 
       IFNULL(dp.price, m.price) AS final_price, 
       IFNULL(o.discount_percentage, 0) AS discount_percentage,
       IFNULL(o.start_date, 'N/A') AS offer_start_date,
       IFNULL(o.end_date, 'N/A') AS offer_end_date,
       c.name AS category_name, 
       m.availability,
       GROUP_CONCAT(t.name) AS tags,
       GROUP_CONCAT(mi.image_url) AS image_urls
FROM Menu m
LEFT JOIN Dynamic_Pricing dp ON m.menu_item_id = dp.menu_item_id
AND TIME(NOW()) BETWEEN dp.start_time AND dp.end_time
AND FIND_IN_SET(DAYNAME(NOW()), dp.days_of_week) > 0
LEFT JOIN Offers o ON m.menu_item_id = o.menu_item_id
AND NOW() BETWEEN o.start_date AND o.end_date
LEFT JOIN Categories c ON m.category_id = c.category_id
LEFT JOIN Menu_Tags mt ON m.menu_item_id = mt.menu_item_id
LEFT JOIN Tags t ON mt.tag_id = t.tag_id
LEFT JOIN Menu_Images mi ON m.menu_item_id = mi.menu_item_id
GROUP BY m.menu_item_id, m.name, m.description, m.price, dp.price, o.discount_percentage, 
         o.start_date, o.end_date, c.name, m.availability;

    `;

    // Execute the query using await
    const [results] = await mysqlPool.query(query);

    res.status(200).json({ menuItems: results });
  } catch (err) {
    console.error("Error fetching menu data:", err);
    res.status(500).json({ error: "Failed to fetch menu data" });
  }
});

// Set port with fallback if the environment variable is not set
const PORT = process.env.MY_PORT || 6000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
