'use strict';

const socket = io('https://rah-webrtc.herokuapp.com', { forceNew: true });

socket.on('connect', () => {
  document.getElementById('socketId').innerText = socket.id;
})

const pc = new RTCPeerConnection();
const dataChannel = pc.createDataChannel('dataChannel', null)

const hogeButton = document.getElementById('hogeButton');
hogeButton.addEventListener('click', () => {
  dataChannel.send('hoge')
  console.log('hoge clicckedd')
})
