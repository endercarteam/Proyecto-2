const user = require('../model/user_model');

async function update_user(data) {
  try {
    // Buscamos el usuario en la base de datos
    const userName = data.userName;
    const user_up = await user.findOne({userName});
    
    if (data.role) {
      user_up.role = data.role;
    }
    // Actualizar campos permitidos
    if (data.name) user_up.name = data.name;
    if (data.lastName) user_up.lastName = data.lastName;
    
    if(data.password) user_up.password = data.password;
     
    
    

    await user_up.save();

    return {
      status: 200,
      body: {
        message: 'Usuario actualizado correctamente',
        user: {
          id: user_up._id,
          userName: user_up.userName,
          name: user_up.name,
          lastName: user_up.lastName,
          role: user_up.role,
          
        },
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

module.exports = { update_user };