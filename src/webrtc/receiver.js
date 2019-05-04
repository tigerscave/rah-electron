'use strict';
const { ipcRenderer } = require('electron');

const socket = io('http://localhost:3100', { forceNew: true });
console.log(socket)
socket.on('connect', () => {
  document.getElementById('socketId').innerText = socket.id;
})

let pc = new RTCPeerConnection();

const handleIceCandidate = event => {
  const { condidate } = event;
  if (condidate) {
    console.log('---handleOnLocalIceCandidate---')
    const newIceCondidate = new RTCIceCandidate(condidate);
    pc.addIceCandidate(newIceCondidate);
  }
};

const handleOnTrackConnection = event => {
  console.log("---handleOnTrackConnection---", event);
  const remoteVideo = document.getElementById('remoteVideo')
  remoteVideo.srcObject = event.streams[0];
};

const handleMessageReceived = event => {
  const { data } = event;
  console.log(data)
  switch (data) {
    case 'turn-on':
      ipcRenderer.send('turn-on');
      break
    case 'turn-off':
      ipcRenderer.send('turn-off');
      break
    default:
      ipcRenderer.send('turn-off');
  }
  ipcRenderer.send('led', parsedData.shouldLedBlink);
  
//  ipcRenderer.send('turn-off')
}

const handleDataChannel = event => {
  const { channel } = event;
  console.log(channel)
  channel.addEventListener('message', handleMessageReceived);
}

const createAnswer = (senderId, description) => {
  pc.addEventListener('icecandidate', handleIceCandidate);
  
  pc.setLocalDescription(description).then(() => {
    pc.addEventListener('track', handleOnTrackConnection);
    pc.addEventListener('datachannel', handleDataChannel);
    
    socket.emit('answerFromReceiver', {
      description,
      userId: senderId
    })
    
    console.log("pc", pc.connectionState)
  })
}

socket.on('offerToReceiver', data => {
  const { description, senderId } = data;
  pc.setRemoteDescription(description)
    .then(() => {
      pc.createAnswer()
        .then(description => createAnswer(senderId, description))
    })
})

const onTurnOnOff = () => {
  ipcRenderer.send('turn-on')
  console.log('clicked me')
}

const turnOnOff = document.getElementById('turnOnOff')
turnOnOff.addEventListener('click', onTurnOnOff)
