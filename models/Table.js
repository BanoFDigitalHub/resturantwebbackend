const mongoose = require('mongoose');

const TableSchema = new mongoose.Schema({
  tableNo: { type: Number, required: true, unique: true },
  capacity: { type: Number, required: true },
  status: { type: String, default: 'active' }
});

module.exports = mongoose.model('Table', TableSchema);
