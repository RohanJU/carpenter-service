const mongoose = require("mongoose");

const connectDB = async (uri, db) => {
  await mongoose.connect(uri, {
    dbName: db,
  });
};

module.exports = connectDB;
