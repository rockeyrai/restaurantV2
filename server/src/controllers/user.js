const { mysqlPool } = require("../database/MySql");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


const userLogin = async (req, res) => {
  const { email, password } = req.body;

  // Input validation
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required." });
  }

  try {
    // Check for user by email
    const [results] = await mysqlPool.query(
      "SELECT * FROM Users WHERE email = ?",
      [email]
    );

    if (results.length === 0) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    const user = results[0];

    // Compare password with hash
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    // Generate JWT
    const token = jwt.sign(
      { user_id: user.user_id, username: user.username, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({
      message: "Login successful.",
      token,
      user: {
        user_id: user.user_id,
        username: user.username,
        email: user.email,
        phone_number: user.phone_number,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("Error during user login:", err);
    res.status(500).json({ message: "Internal server error.", error: err.message });
  }
};



const userRegister = async (req, res) => {
  const { username, email, password, phone_number, role } = req.body;

  // Input validation
  if (!username || !email || !password) {
    return res.status(400).json({ message: "Username, email, and password are required." });
  }

  try {
    // Check for existing user
    const [results] = await mysqlPool.query(
      "SELECT * FROM Users WHERE email = ? OR username = ?",
      [email, username]
    );

    if (results.length > 0) {
      return res.status(400).json({ message: "User with this email or username already exists." });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user into the database
    const [insertResult] = await mysqlPool.query(
      "INSERT INTO Users (username, email, password_hash, phone_number, role) VALUES (?, ?, ?, ?, ?)",
      [username, email, hashedPassword, phone_number, role || "customer"]
    );

    // Generate JWT
    const token = jwt.sign(
      { user_id: insertResult.insertId, username, email, role: role || "customer" },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(201).json({
      message: "User registered successfully.",
      token,
      user: {
        user_id: insertResult.insertId,
        username,
        email,
        phone_number,
        role: role || "customer",
      },
    });
  } catch (err) {
    console.error("Error during user registration:", err);
    res.status(500).json({ message: "Internal server error.", error: err.message });
  }
};

module.exports = {userLogin,userRegister}