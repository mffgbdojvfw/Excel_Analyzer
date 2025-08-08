const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config(); // Load .env variables

const connect = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log("Connected successfully to MongoDB Atlas!");
  } catch (err) {
    console.error("MongoDB connection error:", err);
  }
};

module.exports = connect;
