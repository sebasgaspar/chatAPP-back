const express = require('express');
const path = require('path');
const { Server } = require("socket.io");
require('dotenv').config();


//DB config
const { dbConection } = require('./database/config');
dbConection();


// App de Express
const app = express();


//Lectura y parseo del body
app.use(express.json());
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});

// Node Server
const server = require('http').createServer(app);
module.exports.io = new Server(server, {
    cors: {
        allowedHeaders: ["X-API-KEY"],
        credentials: true
    }
});
require('./sockets/socket');


// Path público
const publicPath = path.resolve(__dirname, 'public');
app.use(express.static(publicPath));

//Mis Rutas
app.use('/api/login', require('./routes/auth'));
app.use('/api/usuarios', require('./routes/usuarios'));
app.use('/api/mensajes', require('./routes/mensajes'));


server.listen(process.env.PORT, (err) => {

    if (err) throw new Error(err);

    console.log('Servidor corriendo en puerto', process.env.PORT);

});


