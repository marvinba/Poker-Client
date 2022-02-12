const electron = require('electron');
const {ipcRenderer} = electron;
const {CashGame} = require('./CashGame');


document.getElementById('submitNumPlayers').addEventListener('click', processInput);


function processInput(){
    let textInput = document.getElementById('numPlayers').value; 
    if(!Number.isInteger(+textInput)){
        document.getElementById('numPlayers').value = '';

        document.getElementById('inputError').innerHTML = "Decimals aren't allowed."
    }
    else if ((parseInt(textInput) < 2) || (parseInt(textInput) > 10)){
        document.getElementById('numPlayers').value = '';

        document.getElementById('inputError').innerHTML = "Your input is out of range."
    }   
    else {//valid input
        document.getElementById('numPlayers').value = '';
        document.getElementById('inputError').innerHTML = "";        
        
        const stakesTypeGetID = document.getElementById('stakes-select');
        const stakesType = stakesTypeGetID.options[stakesTypeGetID.selectedIndex].text;

        ipcRenderer.send("Create cashGame with size and stakes input", [parseInt(textInput), stakesType]);
    }
}

//const textInput = document.getElementById('numPlayers').textContent;