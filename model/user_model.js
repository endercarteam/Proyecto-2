const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');
dotenv.config();  // Carga las variables de entorno

const SALT_MANUAL = process.env.PASSWORD_SALT;
const UserSchema = new mongoose.Schema({
  userName: { type: String, unique: true },
  name: String,
  lastName: String,
  password: String,
  role: String,
  enable: { type: Boolean, default: true },

});

UserSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    const saltedPassword = SALT_MANUAL + this.password;  // Usar SALT_MANUAL directamente
    this.password = await bcrypt.hash(saltedPassword, 10);  // bcrypt.hash requiere un segundo parámetro (salt rounds)
  }
  next();
});
UserSchema.methods.comparePassword = async function (candidatePassword) {
  const saltedCandidate = SALT_MANUAL + candidatePassword;
  return await bcrypt.compare(saltedCandidate, this.password);
};
module.exports = mongoose.model('user', UserSchema);