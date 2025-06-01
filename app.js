const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const app = express();

dotenv.config();
app.use(express.json());

app.use('/api/', require('./Routes/user_routes'));
app.listen(process.env.PORT, () => {
    console.log(`server escuchando en el puerto ${process.env.PORT}`);

});
app.get("/health", (_, res) => res.sendStatus(200)); 
mongoose.connect(process.env.MONGODB_URI)
.then(() => console.log('Conexión exitosa a MongoDB'))
.catch((error) => console.log('Error de conexión a MongoDB:', error));