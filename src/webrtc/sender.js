'use strict';
const io = require('socket.io-client');
const socket = io(process.env.SIGNALING_SERVER);

socket.on('connect', () => {
  document.getElementById('socketId').innerText = socket.id;
})

const localVideo = document.getElementById('localVideo');

const handleLocalMediaStream = mediaStream => {
  localVideo.srcObject = mediaStream
  console.log('---MediaStreams---')
  console.log(mediaStream)
}
const onClickedStartButton = () => {
  navigator.mediaDevices.getUserMedia({video: true, audio: false})
    .then(handleLocalMediaStream)
    .catch(() => {
      alert('Error: Cannot load media stream')
    })
}

const startButton = document.getElementById('startButton');
startButton.addEventListener('click', onClickedStartButton)
