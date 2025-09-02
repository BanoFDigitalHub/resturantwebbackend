const mongoose = require('mongoose');
const connectDB = require('./config/db');
const Table = require('./models/Table');

const seedTables = [
  { tableNo: 1, capacity: 1 },
  { tableNo: 2, capacity: 1 },
  { tableNo: 3, capacity: 2 },
  { tableNo: 4, capacity: 2 },
  { tableNo: 5, capacity: 4 },
  { tableNo: 6, capacity: 4 },
  { tableNo: 7, capacity: 4 },
  { tableNo: 8, capacity: 4 },
  { tableNo: 9, capacity: 6 },
  { tableNo: 10, capacity: 6 },
  { tableNo: 11, capacity: 6 },
  { tableNo: 12, capacity: 8 },
  { tableNo: 13, capacity: 10 },
  { tableNo: 14, capacity: 3 },
  { tableNo: 15, capacity: 5 },
];

const seedDB = async () => {
  await connectDB();
  await Table.deleteMany({});
  await Table.insertMany(seedTables);
  console.log('Tables seeded!');
  mongoose.connection.close();
};

seedDB();
