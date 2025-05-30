const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotendv');
const app = express();

dotenv.config();
app.use(express.json());
mongoose.connect(process.env.MONGODB_URI);
app.use('api_usuarios', require('./Rutas/routes'));
app.listen(process.env.PORT, () => {
    console.log(`server escuchando en el puerto ${process.env.PORT}`);

});
mongoose.connection
    .on('connected', () => console.log('conexxion exitosa'))
    .on('error', (error) => console.log('error de conexion', error))
    .on('disconnected', () => console.log('desconectado de la base de datos'));