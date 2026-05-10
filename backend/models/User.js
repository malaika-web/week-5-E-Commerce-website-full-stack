const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    phone: { type: String, default: '' },
    avatar: { type: String, default: '' },
    isEmailVerified: { type: Boolean, default: false },
    rememberPreference: { type: Boolean, default: false },
    addresses: [
      {
        label: { type: String, default: 'Home' },
        fullName: { type: String, default: '' },
        phone: { type: String, default: '' },
        line1: { type: String, required: true },
        city: { type: String, default: '' },
        postalCode: { type: String, default: '' },
        country: { type: String, default: 'Pakistan' },
        isDefault: { type: Boolean, default: false },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
