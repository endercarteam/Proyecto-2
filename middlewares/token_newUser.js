const jwt = require('jsonwebtoken');

function generateToken(user) {
  // user es el documento de MongoDB con _id y userTipe
  return jwt.sign(
    { id: user._id.toString(), role: user.userTipe },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );
}
module.exports = { generateToken};