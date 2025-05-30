const acciones = require('./acciones/')
exports.registro = async (req, res) => {
    try {
        await acciones.Registro(req.body);
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
exports.actualizarUsuario = async (req, res) => {
    try {
        await acciones.actualizarUsuario(req.body);
        res.status(201).json({ message: 'Usuario registrado exitosamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};
exports.eliminarUsuario = async (req, res) => {
    try {
        await acciones.eliminarUsuario(req.body);
        res.status(201).json({ message: 'Usuario registrado exitosamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};