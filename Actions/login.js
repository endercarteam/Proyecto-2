const { generateToken } = require('../middlewares/token_newUser');
const User = require('../model/user_model');

async function login_user(Login_data) {
  const userName = Login_data.userName;
  const password = Login_data.password;

  const user = await User.findOne({ userName });
  

  const token = generateToken(user);

  return {
    status: 200,
    body: {
      message: 'Login exitoso',
      token,
      user: {
        id: user._id,
        role: user.role,
        userName: user.userName,
      },
    },
  };
}

module.exports = { login_user };