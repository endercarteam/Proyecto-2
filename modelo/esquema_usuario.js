const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const SALT_MANUAL = process.env.PASSWORD_SALT
const UsuarioSchema = new mongoose.Schema({
  usuario: { type: String, unique: true },
  nombre: String,
  apellido: String,
  contraseña: String,
  Tipo_Usuario: String,
  inhabilitado: { type: Boolean, default: false },

});

UsuarioSchema.pre('save', async function (next) {
  if (this.isModified('contraseña')) {
    const saltedPassword = SALT_MANUAL + this.contraseña;
    this.contraseña = await bcrypt.hash(this.contraseña, 10);
  }
  next();
});

module.exports = mongoose.model('Usuario', UsuarioSchema);