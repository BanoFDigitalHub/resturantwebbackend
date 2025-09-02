const mongoose = require('mongoose');

const ReservationSchema = new mongoose.Schema({
  customerName: { type: String, required: true },
  email: { type: String, required: true },
  guests: { type: Number, required: true },
  date: { type: String, required: true },
  slot: { type: String, required: true },
  tableNo: { type: Number, required: true },
  status: { type: String, default: 'reserved' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Reservation', ReservationSchema);
