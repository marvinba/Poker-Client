const electron = require('electron');
const {ipcRenderer} = electron;

document.getElementById('depositBtn').addEventListener('click')
document.getElementById('withdrawBtn').addEventListener('click')
document.getElementById('transferBtn').addEventListener('click')


ipcRenderer.on('update: User Cashier Info', (e, userInfo) =>{
    //display info including balance, username, and user info on window
    
})