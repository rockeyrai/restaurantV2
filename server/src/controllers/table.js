const { mysqlPool } = require("../database/MySql");
// Check table availability
const checkTable = async (req, res) => {
  try {
      const [rows] = await mysqlPool.query(`
          SELECT * FROM Tables 
      `);
      res.json(rows);
  } catch (error) {
      console.error(error);
      res.status(500).send('Error fetching table availability');
  }
};

// Reserve a table
const reserveTable = async (req, res) => {
  const { user_id, table_id } = req.body;
  try {
      const [result] = await mysqlPool.query(`
          UPDATE Tables SET available = FALSE, order_id = ? WHERE id = ? AND available = TRUE
      `, [user_id, table_id]);

      if (result.affectedRows === 0) {
          return res.status(400).send('Table already reserved or does not exist');
      }

      res.json({ success: true, message: 'Table reserved successfully' });
  } catch (error) {
      console.error(error);
      res.status(500).send('Error reserving table');
  }
};

module.exports = {checkTable,reserveTable}