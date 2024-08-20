import mongoose, { ConnectOptions } from "mongoose";

// Set the MongoDB connection options
mongoose.set("strictQuery", true);

const connectDB = async (config: any): Promise<void> => {
  try {
    console.log(process.env.MONGODB_URL,'MONGODB_URL'
    )
    await mongoose.connect(config.mongo.uri);
    console.log("Connected to the MongoDB database");
  } catch (error) {
    console.error("Error connecting to the MongoDB database:", error);
    process.exit(1);
  }
};

export default connectDB; 