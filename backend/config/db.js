import mongoose from "mongoose";
import { configDotenv } from "dotenv";

const connectToDatabase = () => {
  configDotenv({ path: "./.env" });
  mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
      console.log("database connected");
    })
    .catch((err) => {
      console.log(err);
    });
};

export default connectToDatabase;
