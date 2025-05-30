const express = require('express');
const C_usuario = require('../Controlador/C_usuario')
const router = express.Router();


router.post('/registro', C_usuario.registro); 
router.post('/login', Cusuario.login);
router.get('/usuarios/:id', C_usuario.obtenerUsuarioPorId);
router.put('/usuarios/:id', C_usuario.actualizarUsuario);
router.delete('/usuarios/:id', C_usuario.eliminarUsuario);