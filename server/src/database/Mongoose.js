// database/mongodb.js
const mongoose = require('mongoose');

// MongoDB Connection
const connectMongoDB = async () => {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/restaurant2');
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error('Error connecting to MongoDB:', err);
    process.exit(1); // Exit process on connection error
  }
};

// Export the connection function and mongoose for models
module.exports = {
  connectMongoDB,
  mongoose,
};