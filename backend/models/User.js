const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String, default: null },
  dateOfBirth: { type: String, default: null },
  gender: { type: String, default: null },
  locality: { type: String, default: null },
  pinCode: { type: String, default: null },
  avatar: { type: String, default: 'img/user/user.png' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);