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
  
    // Step 1: Check if user exists
    try {
      const [userExists] = await mysqlPool.query(`
        SELECT user_id FROM Users WHERE user_id = ?
      `, [user_id]);
  
      if (userExists.length === 0) {
        return res.status(404).send('User not found');
      }
  
      // Step 2: Attempt to reserve table
      const [result] = await mysqlPool.query(`
        UPDATE Tables 
        SET available = FALSE, user_id = ? 
        WHERE id = ? AND available = TRUE
      `, [user_id, table_id]);
  
      // Step 3: Check if the table was successfully reserved
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