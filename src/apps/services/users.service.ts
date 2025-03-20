import mongoose from 'mongoose';
import { UserModel } from '../models';

class UserService {
  // Get a single user by ID
  static async getUserById(id: string) {
    return await UserModel.findById(id);
  }

  static async getUsers(filter: any = {}, options: any = {}) {
    return await UserModel.find(filter, options);
  }

  static async getUserByEmail(email: string) {
    return await UserModel.findOne({ email });
  }

  static async getUsersByEmails(emails: string[]) {
    return await UserModel.find({ email: { $in: emails } });
  }
  // Create a new user
  static async createUser(userData: any) {
    const [user] = await UserModel.create([userData]);
    console.log('user created');
    return user;
  }

  // Update a user
  static async updateUser(id: string, updateData: any) {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      const user = await UserModel.findByIdAndUpdate(id, updateData, {
        new: true,
      });
      return user;
    } catch (error) {
      return await UserModel.findByIdAndUpdate(id, updateData, { new: true });
    }
  }

  // Delete a user
  static async deleteUser(id: string) {
    return await UserModel.findByIdAndDelete(id);
  }
}

export default UserService;
