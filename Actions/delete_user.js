const user = require('../model/user_model');

async function delete_user(data) {
  try {
    // Buscamos el usuario en la base de datos
    const userName = data.userName;
    const user_up = await user.findOne({userName});
    
    
    // Actualizar campos permitidos
    user_up.enable = data.enable == false
    
    

    await user_up.save();

    return {
      status: 200,
      body: {
        message: 'Usuario eliminado correctamente'
      },
    };
  } catch (error) {
    console.error(error);
    return {
      status: 500,
      body: { error: 'Error interno del servidor' },
    };
  }
}

module.exports = { delete_user };