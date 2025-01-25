const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Session Schema (for managing user sessions)
const SessionSchema = new Schema({
  user_id: { type: Number, required: true }, // Change ObjectId to Number
  session_id: { type: String, required: true },
  expires_at: { type: Date, required: true },
  last_activity_at: { type: Date, default: Date.now } // Track last activity
});


const Session = mongoose.model('Session', SessionSchema);

// Export the models
module.exports = Session;