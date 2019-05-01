const express = require('express');
const app = express();
const path = require('path');
const server = require('http').createServer(app);
const io = require('socket.io')(server);

const port = process.env.PORT || 3000;

connections = [];

server.listen(port, () => {
    console.log('Server running ...', port);
})

app.use(express.static(path.join(__dirname, 'src')))

// app.get('/', (req, res) => {
//     res.sendFile(__dirname + '/src/index.html');
// });
//
// app.get('/handleDom.js', (req, res) => {
//     res.sendFile(__dirname + '/src/handleDom.js');
// });

io.on('connection', (socket) => {

    connections.push(socket);
    console.log('connected: %s sockets connected', connections.length)

    // Disconnect
    socket.on('disconnect', () => {
        connections.splice(connections.indexOf(socket), 1);
        console.log('Disconnected: %s sockets connected', connections.length);
    });

    // Send Messages
    socket.emit('send messages', (msg) => {
        console.log('messssssss', msg)
    })

    socket.on('sendmessages', (msg) => {
        console.log('messages', msg);
        socket.emit('send messages', msg)
    })
})
