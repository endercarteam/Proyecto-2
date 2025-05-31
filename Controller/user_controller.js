const register = require('../Actions/register');
const login = require('../Actions/login');
const update = require('../Actions/update_user');
const get_user = require('../Actions/get_user');
const get_users = require('../Actions/get_users');
const delete_user = require('../Actions/delete_user');
exports.register = async (req, res) => {
    if (!req.body || !req.body.userName || !req.body.password || !req.body.name || !req.body.UserTipe) {
            return res.status(400).json({ error: 'Faltan datos requeridos' });
        }
    
    try {
        
        await acciones.register(req.body);
        res.status(201).json({ message: 'Usuario registrado exitosamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};
exports.login = async (req, res) => {
    try {
        await acciones.login(req.body);
        res.status(201).json({ message: 'Usuario registrado exitosamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};
exports.get_users = async (req, res) => {
    try {
        await acciones.consulta(req.body);
        res.status(201).json({ message: 'Usuario registrado exitosamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

exports.get_users = async (req, res) => {
    try {
        await acciones.consulta_usr(req.body);
        res.status(201).json({ message: 'Usuario registrado exitosamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};
exports.update = async (req, res) => {
    try {
        await acciones.actualizarUsuario(req.body);
        res.status(201).json({ message: 'Usuario registrado exitosamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};
exports.delete_user = async (req, res) => {
    try {
        await acciones.eliminarUsuario(req.body);
        res.status(201).json({ message: 'Usuario registrado exitosamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};