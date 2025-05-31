const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { use } = require('react');
const SALT_MANUAL = process.env.PASSWORD_SALT
const UserSchema = new mongoose.Schema({
  userName: { type: String, unique: true },
  name: String,
  lastName: String,
  password: String,
  userTipe: String,
  enable: { type: Boolean, default: true },

});

UserSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    const saltedPassword = SALT_MANUAL + this.password;
    this.password = await bcrypt.hash(saltedPassword);
  }
  next();
});

module.exports = mongoose.model('Usuario', UserSchema);