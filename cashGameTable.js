const electron = require('electron');
const {ipcRenderer} = electron;
const {CashGame} = require('./CashGame');
const io = require("socket.io-client");
const socket = io('http://localhost:3000');


//global variable userName or playerName (can't use global variables inside imported functions need to export)
//find a way to break cyclic module dependencies
let username = "bareby";
//module.exports.username = username;
let userBalance;
let cashGameVar;


//update balance when change to balance by sending to main then database

//how to set up button event handlers for users connected to a room with username and balance on hand?

ipcRenderer.on('create sample cashGame', (e, szStakesArr) =>{
  let a = new CashGame(szStakesArr[0], szStakesArr[1]);
})

//should you do create first then create add to listings????
ipcRenderer.on('Create Cash Game', (e, userNCashGameInfo) =>{
  //[username, userBalance] = userNCashGameInfo[0]; decomment later

    //[[username, userBalance], newCashGameInfo]
      //[nameOfTable, gameType, limitType, stakesType, numOfPlayers]
    console.log('in ipcRenderer create cash game')
    //socket.emit('Create room for new Cash', userNCashGameInfo[1]);

    //for testing purposes  
    document.getElementsByClassName('table')[0].textContent  = userNCashGameInfo[1][4];


    cashGameVar = new CashGame(userNCashGameInfo[1][0], userNCashGameInfo[1][1], 
      userNCashGameInfo[1][2], userNCashGameInfo[1][3], userNCashGameInfo[1][4], ['bar3by', 15]); 
        //userNCashGameInfo[0] add as last parameter, for now use sample username n balance

    
})

socket.on("Join room for existing Cash", );

  /*
  HOW STATS ARE CALCULATED!!!!
  ----------------------------
  Name of the table
  Avg pot: average size of the pot (based on the last 20 hands)
  Avg stack: average stack size (based on the last 20 hands)
  Plrs/Flop: Percentage of players who see the flop (based on the last 20 hands)
  */
 
/*  
ipcRenderer.send('lobby update listing', ()=>{

})

ipcRenderer.send('lobby: update balance', ()=>{

})
*/