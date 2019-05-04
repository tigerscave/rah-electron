const electron = require('electron');
const url = require('url');
const path = require('path');
const five = require('johnny-five');

const { app, BrowserWindow, ipcMain } = electron;

let mainWindow

let board = new five.Board();

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
  
  board.on('ready', () => {
    let led = new five.Led(13)
    ipcMain.on('turn-on', (event, arg) => {
      console.log('---turn-on---')
      console.log(event, arg)
      led.on()
    })

    ipcMain.on('turn-off', () => {
      led.off()
    })
  })
});


