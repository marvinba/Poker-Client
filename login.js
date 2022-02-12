const electron = require('electron');
const {ipcRenderer} = electron;

document.getElementById('login_form').addEventListener('submit', submitLogin);

//set up autologin and remember for login
function submitLogin(e){
    e.preventDefault();
    const user = document.querySelector('#user').value;
    const password = document.querySelector('#password').value;
    ipcRenderer.send('login', {"username": user,"password": password});
    document.querySelector('#user').value = ''
    document.querySelector('#password').value = ''

    //if login goes thru, close window
   // window.close();
}    

document.getElementById('newAccountLink').addEventListener('click', ()=>{
    ipcRenderer.send('open Registration Window', 'link');
})

//send data to ipcMain to open new browserWindow for register if user clicks register

ipcRenderer.on('Login message', (e) =>{
    document.getElementById('errorDiv').innerHTML = "Error: " + "suc"
})


ipcRenderer.on('Login error', (e, errorMsg) =>{
    document.getElementById('errorDiv').innerHTML = "Error: " + errorMsg
})

