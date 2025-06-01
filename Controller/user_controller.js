const {register} = require('../Actions/register_user');
const {login_user} = require('../Actions/login');
const {update_user} = require('../Actions/update_user');

const {get_users} = require('../Actions/get_users');
const {delete_user} = require('../Actions/delete_user');
const User = require('../model/user_model');
exports.register_controller =  async (req, res) => {
    if (!req.body || !req.body.userName || !req.body.password || !req.body.name || !req.body.role) {
            return { status: 400, body: { error: 'Faltan datos requeridos' } };
        }
    if (req.user.role !== 'admin') {
        return {status: 403, body : { error: 'No tienes permiso para registrar usuarios' }};
    }
    
    try {
        
        await register(req.body);
        return { status: 201, body: { message: 'Usuario registrado exitosamente' } };
    } catch (error) {
        console.error(error);
        if (error.code === 11000) {  // Código de error de duplicado en MongoDB
      return { status: 409, body: { error: 'El nombre de usuario ya existe' } };
        }
        
        return { status: 500, body: { error: 'Error interno del servidor' } };
    }
};
exports.login = async (req, res) => {
    
    const { userName, password } = req.body;
    const user = await User.findOne({ userName });
    if (!user) {
        return { status: 401, body: { error: 'Usuario no encontrado' } };
    }
    
    const isValid = await user.comparePassword(password);
    if (!isValid) {
        return { status: 401, body: { error: 'Contraseña incorrecta' } };
    }
    
    try {
    const { status, body } = await login_user(req.body);
    return { status, body };
    } catch (error) {
        console.error(error);
        return { status: 500, body: { error: 'error interno' }};
    }
};
exports.get_users_controller = async (req, res) => {
    try {
        const { status, body } = await get_users(req.query);
        return { status, body };
        
    } catch (error) {
        console.error(error);
        return { status: 500, body: { error: 'Error interno del servidor' } };
        
    }
};


exports.update_user_controller = async (req, res) => {
    try {// Validar que el usuario pueda modificar
    const userName = req.body.userName;    
    if (!userName) {
        return { status: 400, body: { error: 'Falta el nombre de usuario' } };
    }
    const user = await User.findOne({ userName });
    if (!user) {
      return { status: 404, body: { error: 'Usuario no encontrado' } };
    }

    const authenticatedUserId = req.user.id;
    const authenticatedUserRole = req.user.role;

    
    // Si no es admin ni el mismo usuario, denegar
    if (authenticatedUserRole !== 'admin' && authenticatedUserId !== user._id.toString()) {
      return {status: 403, body : { error: 'No tienes permiso para actualizar este usuario' }};
    }

    // Si no es admin, eliminamos el campo 'role' para evitar cambios no autorizados
    if (authenticatedUserRole !== 'admin') {
      delete req.body.role;
    }

    const { status, body } = await update_user(req.body);
    return {status, body};
  } catch (error) {
    console.error(error);
    return {status: 500, body: { error: 'Error interno del servidor' }};
  }
};
exports.delete_use_controller = async (req, res) => {
    try {
        const userName = req.body.userName;    
    if (!userName) {
        return { status: 400, body: { error: 'Falta el nombre de usuario' } };
    }
    const user = await User.findOne({ userName });
    if (!user) {
      return { status: 404, body: { error: 'Usuario no encontrado' } };
    }

    const authenticatedUserId = req.user.id;
    const authenticatedUserRole = req.user.role;

    
    // Si no es admin ni el mismo usuario, denegar
    if (authenticatedUserRole !== 'admin' && authenticatedUserId !== user._id.toString()) {
      return {status: 403, body : { error: 'No tienes permiso para borrar este usuario' }};
    }

    // Si no es admin, eliminamos el campo 'role' para evitar cambios no autorizados
    

    const { status, body } = await delete_user(req.body);
    return {status, body};
  } catch (error) {
    console.error(error);
    return {status: 500, body: { error: 'Error interno del servidor' }};
  }
};