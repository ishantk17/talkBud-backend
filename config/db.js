const mongoose = require("mongoose");

const connectDB = async () => {
  const uri=process.env.MONGODB_URI;
  try {
    const conn = await mongoose.connect(
      uri
    );
    console.log(`MongoDB connected ${conn.connection.host}`);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};
module.exports = connectDB;
