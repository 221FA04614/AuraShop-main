import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String },
  // Add these two fields for password reset
  resetPasswordOtp: { type: String },
  resetPasswordExpires: { type: Date },
});

export default mongoose.model('User', UserSchema);