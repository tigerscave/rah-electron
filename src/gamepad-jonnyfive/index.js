'use strict';
const { ipcRenderer } = require('electron');

console.log("hello")

const haveEvents = 'GamepadEvent' in window;
const rAF = window.webkitRequestAnimationFrame ||
  window.requestAnimationFrame;

const connecthandler = (e) => {
  addGamepad(e.gamepad);
  
}

const addGamepad = e => {
  rAF(updateStatus)
}

const header = document.getElementById('header');
let lastGpAxes = 0;

const updateStatus = () => {
  scangamepads();
  const gp = navigator.getGamepads()[0];
  
  let gpAxes1 = gp.axes[0];
  //let gpAxes2 = gp.axes[1];
  //let gpAxes3 = gp.axes[2];
  
  // console.log("gamepad: ",gp)
  
  if (gp.buttons[0].pressed) {
    ipcRenderer.send('turn-on');
  }
  
  if (gp.buttons[1].pressed) {
    ipcRenderer.send('turn-off');
  }
  
  
  if (gp.axes[0]) {
    
    if(Math.abs(lastGpAxes - gpAxes1 ) > 0.1) {
      console.log(gpAxes1);
      lastGpAxes = gpAxes1;
      ipcRenderer.send('servo-to3', gpAxes1);
    }
    //ipcRenderer.send('servo-to3', gpAxes1)
  }
  
  // if (gp.axes[1]) {
  //   ipcRenderer.send('servo-to5', gpAxes2)
  // }
  //
  // if (gp.axes[2]) {
  //   ipcRenderer.send('servo-to6', gpAxes3)
  // }
  rAF(updateStatus)
}

function scangamepads() {
  const gamepads = navigator.getGamepads ? navigator.getGamepads() : (navigator.webkitGetGamepads ? navigator.webkitGetGamepads() : []);
  addGamepad(gamepads);
}

if (haveEvents) {
  window.addEventListener("gamepadconnected", addGamepad);
  window.addEventListener("gamepaddisconnected", () => {
    console.log('gamepad disconnected ...  ')
  });
} else {
  setInterval(scangamepads, 500);
}




