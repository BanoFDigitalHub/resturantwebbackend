const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const reservationRoutes = require('./routes/reservation');

const app = express();
const PORT = 5000;

// Connect to DB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', reservationRoutes);

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
