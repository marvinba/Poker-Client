const electron = require('electron');
const {ipcRenderer} = electron;

document.getElementById("register_form").addEventListener('submit', submitRegister);

//do input validation for email & username (check both for any repeats), and password

function submitRegister(e){
    e.preventDefault();
    const email = document.querySelector('#email').value;
    const user = document.querySelector('#user').value;
    const password = document.querySelector('#password').value;
    ipcRenderer.send('register', {email: email, username: user, password: password});
    document.querySelector('#email').value = ''
    document.querySelector('#user').value = ''
    document.querySelector('#password').value = ''
    
    //if registration goes thru, close window
}

document.getElementById('loginLink').addEventListener('click', ()=>{    
    ipcRenderer.send('open Login Window', 'link');
})

ipcRenderer.on('Registration error', (e, errorMsg) =>{
    document.getElementById('errorDiv').innerHTML = "Error: " + errorMsg
})

