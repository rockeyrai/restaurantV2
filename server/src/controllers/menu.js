const { mysqlPool } = require("../database/MySql");
const Order = require("../model/OrderSchema ");

const getMenu = async (req, res) => {
  try {
    const query = `
      SELECT m.menu_item_id, m.name, m.description, m.price AS original_price, 
             IFNULL(dp.price, m.price) AS final_price, 
             IFNULL(o.discount_percentage, 0) AS discount_percentage,
             IFNULL(o.start_date, 'N/A') AS offer_start_date,
             IFNULL(o.end_date, 'N/A') AS offer_end_date,
             c.name AS category_name, 
             m.availability,
             GROUP_CONCAT(DISTINCT t.name) AS tags,
             GROUP_CONCAT(DISTINCT mi.image_url) AS image_urls
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

    const [results] = await mysqlPool.query(query);

    res.status(200).json({ menuItems: results });
  } catch (err) {
    console.error("Error fetching menu data:", err);
    res.status(500).json({ error: "Failed to fetch menu data" });
  }
};


const orderFood = async (req, res) => {
  const { user_id, table_id, items } = req.body;

  try {
    // Validate user_id
    const userId = parseInt(user_id, 10);
    if (isNaN(userId)) {
      return res.status(400).json({ error: "user_id must be a valid number" });
    }

    // Validate items array
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: "Items array is required and must not be empty" });
    }

    // Validate item structure
    if (
      items.some(
        (item) =>
          typeof item.menu_item_id !== "number" ||
          typeof item.quantity !== "number" ||
          typeof item.price !== "number"
      )
    ) {
      return res.status(400).json({
        error: "Each item must include menu_item_id, quantity, and price as numbers",
      });
    }

    let tableId = null;

    // If `table_id` is provided, validate it
    if (table_id !== undefined) {
      tableId = parseInt(table_id, 10);
      if (isNaN(tableId)) {
        return res.status(400).json({ error: "table_id must be a valid number" });
      }

      // Check if the table is reserved by the user in the ReservedTable table
      const [reservedTable] = await mysqlPool.query(
        `SELECT * FROM Tables WHERE id = ? AND user_id = ?`,
        [tableId, userId]
      );

      if (reservedTable.length === 0) {
        return res.status(400).json({
          error: "The specified id is not reserved by this user",
        });
      }
    } else {
      // If no `id`, check if the user has any reserved table
      const [reservedTable] = await mysqlPool.query(
        `SELECT * FROM Tables WHERE user_id = ?`,
        [userId]
      );

      if (reservedTable.length > 0) {
        tableId = reservedTable[0].table_id; // Automatically associate the user's reserved table
      }
    }

    // Calculate total cost
    const totalCost = items.reduce((sum, item) => sum + item.quantity * item.price, 0);

    // Create order in MongoDB (you can also save the order in MySQL if needed)
    const order = new Order({
      user_id: userId,
      table_id: tableId || null, // Set `null` if no table is reserved
      items,
      total_cost: totalCost,
    });

    await order.save(); // You might want to insert the order into MySQL instead of MongoDB

    res.status(201).json({ success: true, message: "Order placed successfully", order });
  } catch (error) {
    console.error("Error placing order:", error);
    res.status(500).json({ error: "Error placing order" });
  }
};

module.exports = { getMenu, orderFood };
