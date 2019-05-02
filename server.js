const express = require('express');
const app = express();
const path = require('path');
const server = require('http').createServer(app);
const io = require('socket.io')(server);

const port = process.env.PORT || 3000;

let connections = [];
let users = []

server.listen(port, () => {
  console.log('Server running ...', port);
})

app.use(express.static('src'))

const handleOfferFromSender = (socket, data) => {
  const { description, userId } = data;
  socket.to(userId).emit('offerToReceiver', {
    description,
    senderId: socket.id
  })
};

const handleAnswerFromReceiver = (socket, data) => {
  const { userId, description } = data;
  socket.to(userId).emit('answerToSender', description)
}

io.on('connection', (socket) => {
  connections.push(socket);
  users.push(socket);
  console.log('connected: %s sockets connected', connections.length, users)
  
  // Disconnect
  socket.on('disconnect', () => {
    connections.splice(connections.indexOf(socket), 1);
    users.filter(user => user !== socket.id);
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
  
  socket.on('offerFromSender', data => {
    handleOfferFromSender(socket, data)
  })
  socket.on('answerFromReceiver', data => {
    handleAnswerFromReceiver(socket, data)
  })
})
