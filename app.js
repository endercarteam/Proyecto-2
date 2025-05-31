const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotendv');
const app = express();

dotenv.config();
app.use(express.json());
mongoose.connect(process.env.MONGODB_URI);
app.use('api/usuarios', require('./Routes/user_routes'));
app.listen(process.env.PORT, () => {
    console.log(`server escuchando en el puerto ${process.env.PORT}`);

});
app.get("/health", (_, res) => res.sendStatus(200)); 
mongoose.connection
    .on('connected', () => console.log('conexxion exitosa'))
    .on('error', (error) => console.log('error de conexion', error))
    .on('disconnected', () => console.log('desconectado de la base de datos'));