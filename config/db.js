"use strict";
import mongoose from "mongoose";

const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://0.0.0.0:27017/big-node";

const connectDB = async () => {
  console.log("Trying to connect to database");
  try {
    await mongoose.connect(
      MONGODB_URI
      // ,{
      // useNewUrlParser: true,
      // useUnifiedTopology: true,
      // useCreateIndex: true,
      // useFindAndModify: false,
      // } as ConnectOptions
    );
    console.log("MongoDB connected");
  } catch (err) {
    if (err instanceof mongoose.Error) {
      console.error(err.message);
    } else {
      console.error("An unexpected error occured:", err);
    }

    process.exit(1);
  }
};

export default connectDB;
