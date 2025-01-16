const { mysqlPool } = require("../database/MySql");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userLogin = async (req, res) => {
  const { username, email, password, phone_number, role } = req.body;

  // Input validation
  if (!username || !email || !password) {
    return res.status(400).json({ message: 'Username, email, and password are required.' });
  }

  try {
    // Check for existing user
    const [results] = await mysqlPool.query(
      'SELECT * FROM Users WHERE email = ? OR username = ?',
      [email, username]
    );

    if (results.length > 0) {
      return res.status(400).json({ message: 'User with this email or username already exists.' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user into the database
    const [insertResult] = await mysqlPool.query(
      'INSERT INTO Users (username, email, password_hash, phone_number, role) VALUES (?, ?, ?, ?, ?)',
      [username, email, hashedPassword, phone_number, role || 'customer']
    );

    // Generate JWT
    const token = jwt.sign(
      { user_id: insertResult.insertId, username, email, role: role || 'customer' },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(201).json({
      message: 'User registered successfully.',
      token,
      user: {
        user_id: insertResult.insertId,
        username,
        email,
        phone_number,
        role: role || 'customer'
      }
    });
  } catch (err) {
    console.error('Error during user registration:', err);
    res.status(500).json({ message: 'Internal server error.', error: err.message });
  }
};



module.exports = {userLogin}