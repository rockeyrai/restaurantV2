const mongoose = require('mongoose');
const Schema = mongoose.Schema;


// Delivery Tracking Schema (tracking the status of an order's delivery)
const DeliveryTrackingSchema = new Schema({
  order_id: { type: Number, required: true }, // Reference to MySQL order ID
  delivery_status: { 
      type: String, 
      enum: ['pending', 'in transit', 'delivered', 'failed'], 
      default: 'pending',
  },
  driver_id: { type: Number }, // Optional: reference to the driver responsible
  location: { 
      latitude: { type: Number }, 
      longitude: { type: Number },
  }, // Current geolocation
  estimated_delivery_time: { type: Date }, // Optional estimated time
  updated_at: { type: Date, default: Date.now }, // Timestamp for last update
  event_history: [
      { status: String, timestamp: Date } // History of status changes
  ]
});


const DeliveryTracking = mongoose.model('DeliveryTracking', DeliveryTrackingSchema);

// Export the models
module.exports =  DeliveryTracking ;