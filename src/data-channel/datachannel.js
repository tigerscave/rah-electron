'use strict';

const socket = io('https://rah-webrtc.herokuapp.com', { forceNew: true });

socket.on('connect', () => {
  document.getElementById('socketId').innerText = socket.id;
})
