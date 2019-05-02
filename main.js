const electron = require('electron');
const url = require('url');
const path = require('path');

const { app, BrowserWindow, ipcMain } = electron;

let mainWindow

app.on('ready', () => {
    mainWindow = new BrowserWindow({});

    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'src/index.html'),
        protocol: 'file:',
        slashes: true,
    }));
    
    let receiverWindow;
  
  ipcMain.on('receiver-window', () => {
      if (!receiverWindow) {
          receiverWindow = new BrowserWindow({
            width: 700,
            height: 500,
            parent: mainWindow,
         //   show: false
          });
          
          receiverWindow.loadURL(url.format({
              pathname: path.join(__dirname, 'src/webrtc/receiver.html'),
              protocol: 'file:',
              slashes: true,
          }));
  
        receiverWindow.on('closed', () => {
          receiverWindow = null;
        });
      }
  })
});


