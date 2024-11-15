import mongoose, { Schema, Document, Model, Collection } from 'mongoose';

// Define the User schema
interface IUser extends Document {
  username: string;
  password: string;

}

const UserSchema: Schema = new Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
  }, { collection: 'uno_game.User' });

const User: Model<IUser> = mongoose.model<IUser>('User', UserSchema);

async function createUser(username: string, password: string): Promise<IUser> {
    const user = new User({ username, password });
    return await user.save();
  }
  
  // Get a user by username
  async function getUserByUsername(username: string): Promise<IUser | null> {
    return await User.findOne({ username });
  }

  
  // Delete a user by ID
  async function deleteUser(userName: string): Promise<IUser | null> {
    return await User.findByIdAndDelete(userName);
  }
  

export { User, IUser,  createUser , getUserByUsername, deleteUser };