import { Schema, model } from 'mongoose';

const userSchema = new Schema({
  name: String,
  email: String,
  password: String,
});

userSchema.index({ name: 1, email: 1 }, { unique: true });

const UserModel = model('User', userSchema);

export default UserModel;
