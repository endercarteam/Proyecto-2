const express = require('express');
const {registro, login, actualizarUsuario, eliminarUsuario, } = require('../Controller/user_controller')
const router = express.Router();


router.post('/registro', await registro); 
router.post('/login', Cusuario.login);
router.get('/usuarios/:id', C_usuario.obtenerUsuarioPorId);
router.put('/usuarios/:id', C_usuario.actualizarUsuario);
router.delete('/usuarios/:id', C_usuario.eliminarUsuario);