const express = require('express');
const router = express.Router();
const Table = require('../models/Table');
const Reservation = require('../models/Reservation');

// Available time slots
const SLOTS = [
  '03:00 PM - 04:30 PM',
  '04:30 PM - 06:00 PM',
  '06:00 PM - 07:30 PM',
  '07:30 PM - 09:00 PM',
  '09:00 PM - 10:30 PM',
  '10:30 PM - 12:00 AM'
];

// Check if date is today or within next 7 days
const isValidDate = (dateStr) => {
  const today = new Date();
  const target = new Date(dateStr);
  const diff = (target - today) / (1000 * 60 * 60 * 24);
  return diff >= 0 && diff <= 7;
};

// -------------------- CHECK AVAILABILITY --------------------
router.post('/check-availability', async (req, res) => {
  try {
    let { date, guests } = req.body;
    guests = Number(guests); // Strict number

    // Validate date
    if (!isValidDate(date)) {
      return res.status(400).json({ error: "Bookings allowed only within 7 days." });
    }

    // Fetch only tables with exact capacity match
    const tables = await Table.find({ status: 'active', capacity: guests });

    if (!tables.length) {
      return res.status(200).json({ slots: [], message: "No tables available for your guest count on this date." });
    }

    const result = [];

    for (const slot of SLOTS) {
      // Find tables already reserved for this slot & date
      const reservedTables = await Reservation.find({ date, slot }).select('tableNo');
      const reservedIds = reservedTables.map(r => Number(r.tableNo)); // Strict number

      // Filter only free tables for this slot
      const availableTables = tables.filter(t => !reservedIds.includes(Number(t.tableNo)));

      if (availableTables.length > 0) {
        result.push({
          slot,
          tables: availableTables.map(t => ({
            tableNo: t.tableNo,
            capacity: t.capacity
          }))
        });
      }
    }

    if (!result.length) {
      return res.status(200).json({ slots: [], message: "No tables available for your guest count on this date." });
    }

    res.json({ slots: result });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// -------------------- CONFIRM RESERVATION --------------------
router.post('/confirm-reservation', async (req, res) => {
  try {
    const { name, email, guests, date, slot, tableNo } = req.body;

    if (!isValidDate(date)) return res.status(400).json({ error: "Bookings allowed only within 7 days." });
    if (!email.includes('@')) return res.status(400).json({ error: "Invalid email" });

    // Double-check table availability
    const exists = await Reservation.findOne({ date, slot, tableNo });
    if (exists) return res.status(400).json({ error: "Table already booked for this slot." });

    const reservation = new Reservation({
      customerName: name,
      email,
      guests,
      date,
      slot,
      tableNo
    });

    await reservation.save();
    res.json({ message: "Reservation confirmed!", reservation });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
