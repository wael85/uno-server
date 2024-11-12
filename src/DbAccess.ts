import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { User, IUser } from './model/UserDAO';

// Load environment variables from .env file
dotenv.config();

const uri = `mongodb+srv://${process.env.DB_UNO_USER}:${process.env.DB_UNO_PASS}@uno-cluster.etra0.mongodb.net/?retryWrites=true&w=majority&appName=Uno-cluster`;

async function connectToDatabase() {
  try {
   const c = await mongoose.connect(uri);
    console.log("Connected to MongoDB with Mongoose");
  } catch (error) {
    console.error("Failed to connect to MongoDB", error);
    throw error;
  }
}
async function login(username: string, password: string): Promise<IUser | null> {
    try {
      const user = await User.findOne({ username, password });
      if (user) {
        console.log("Login successful");
        return user;
      } else {
        console.log("Login failed: Invalid credentials");
        return null;
      }
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  }
export { connectToDatabase , login};