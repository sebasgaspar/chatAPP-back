const { io } = require('../index');
const { comprobarJWT } = require('../helpers/jwt');
const { usuarioConectado, usuarioDesconectado, grabarMensaje } = require('../controllers/socket');



// Mensajes de Sockets
io.on('connection', (client) => {
    console.log('Cliente conectado');
    const [valido, uid] = comprobarJWT(client.handshake.query['token']);

    if (!valido) { return client.disconnect(); }
    usuarioConectado(uid);

    client.on('user-connect', () => {
        client.emit('refresh')
    })
    //Ingresar al usuario a una sala en particular
    client.join(uid);



    //Escuchar el mensaje personal
    client.on('mensaje-personal', async (payload) => {
        await grabarMensaje(payload);
        io.to(payload.para).emit('mensaje-personal', payload);
    });

    client.on('disconnect', () => {
        io.emit('refresh')
        usuarioDesconectado(uid);
    });

});
