const {ipcRenderer} = require('electron');

const receiverWindow = document.getElementById('receiverWindow')
receiverWindow.addEventListener('click', () => {
  ipcRenderer.send('receiver-window')
  console.log('button clicked')
})
