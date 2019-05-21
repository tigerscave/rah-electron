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
    let servo3 = new five.Servo({
      pin: 3,
      type: "standard",
      fps: 100
    })
    let servo5 = new five.Servo(5)
    let servo6 = new five.Servo(6)
    
    ipcMain.on('turn-on', (event, arg) => {
      console.log('---turn-on---')
      led.on()
    })

    ipcMain.on('turn-off', () => {
      led.off()
    })
    
    ipcMain.on('servo-to3', (event, arg) => {
      const d = parseInt(arg * 90 + 90)
      console.log(d)
      if(d > 0 && d < 180) {
        servo3.to(d, 100, 5);
      }
    });
  
    ipcMain.on('servo-to5', (event, arg) => {
      servo5.to(arg * 90 + 90);
    });
  
    ipcMain.on('servo-to6', (event, arg) => {
      servo6.to(arg * 90 + 90);
    });
  })
});


