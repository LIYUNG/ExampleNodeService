import { Schema, model } from 'mongoose';

const userSchema = new Schema({
  name: String,
  email: String,
  password: String,
});

const UserModel = model('User', userSchema);

export default UserModel;
