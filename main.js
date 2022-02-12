const path = require('path')
const bcrypt = require('bcrypt')
const electron = require('electron')
const http = require('http');
const express = require('express');
const mysql = require('mysql')
const fs = require('fs');
const socketio = require('socket.io');
const expressApp = express();
const server = http.createServer(expressApp);
const io = socketio(server);
//const {CashGame} = require('./CashGame');

const {app, BrowserWindow, Menu, ipcMain} = electron
let lobbyWindow, accountWindow, loginWindow, registrationWindow
let rememberMeBool, autoLoginBool;
let username, userBalance, cashierWindow;
let createCashGameWindow, createCashGameWindowBoolean = true, hiddenCashGameWindow = false;
let createTournamentWindow, createTournamentWindowBoolean = true;
let createSnGWindow, createSnGWindowBoolean = true;
let approveCashGameName;

let cashGameWindows = [['Bareby', null], ['Yo', null]], tournamentWindows = [], sngWindows = []
let cashierWindowBoolean = true

let autoLoggedBool;

//expressApp.use(express.static("./")); then finds way to open html files via localhost

let sampleGame;

//check why you send auto logged in from here in ready-to-show?!?!
app.on('ready', () => {
  lobbyWindow = new BrowserWindow({ width: 1012, height: 686, autoHideMenuBar: false, skipTaskbar: false, frame: true, resizable: false, show: false, center:true, webPreferences: {nodeIntegration: true}})
  lobbyWindow.loadURL(path.join(__dirname, 'lobbyGUI.html'));
  lobbyWindow.setBounds({width: 1012, height: 686 })

  accountWindow =  new BrowserWindow({ width: 800, height: 400, backgroundColor: '#FF0000', parent: lobbyWindow, show: false, center:true, webPreferences: {nodeIntegration: true}})
  accountWindow.loadURL(path.join(__dirname, 'login.html'));

  lobbyWindow.once('ready-to-show'
  //lobbyWindow.webContents.on('did-finish-load'
  , () => {

    //if selected last time with correct user info, it returns true which you retrieve from server
      //you then send it to lobbyWindow     
    lobbyWindow.send('lobby: Auto Logged In', [autoLoggedBool, username, userBalance]); 
    
    setTimeout(() => {
      lobbyWindow.show();
    }, 300);
    
     sampleGame =  new BrowserWindow({ width: 400, height: 200, show: false, center:true, parent: lobbyWindow, webPreferences: {nodeIntegration: true}})
     sampleGame.loadURL(path.join(__dirname, 'textBasedGUI.html'));
     sampleGame.once('ready-to-show', ()=>{
       sampleGame.show();
     })
   
  })

  accountWindow.on('closed', () => {
    //accountWindow = null
  });
})



//cash game browserWindows are deleted if closed (manually) and if accidentally when disconnect timer is up
//tournament and sngs browswerWindows are not deleted if user still has chips in them

//if someone APPROVES NEW name provided, then change previous LISTING names in database and lobby

//how to populate lobby with listings from database??? 
    //first at app startup then update when you create game(s) and remove game(s)
      //set up how to insert listing to database!!!!! (DONE)
      //THEN FIX NAME VERIFICATION SO THAT IT WORKS WITH DATABASE !!! (DONE)
      //add listing realtime to all clients whenever new cash game created (DONE)     
      //then how to load database to listings
      //remove listing realtime from all clients whenever cash game removed 

//check to see is sorting game browserWindows in array necessary???

io.on('connection', socket =>{
    
  socket.on('create new Cash', (newCashGameInfo, changeFirstBool = false, knowValidName = false) =>{
    //newCashGameInfo : [nameOfTable, gameType, limitType, stakesType, numOfPlayers])   
    
    nameVerification(newCashGameInfo, 'cash', knowValidName).then(validNameBool => {
      if (validNameBool){
        createCashGameWindow.hide(); //will close after you send data back to it and that data is sent to main.js 
        hiddenCashGameWindow = true;

        //change's database listing's name but nothing else when you change first occurence
        if (changeFirstBool){//set it up so that it changes name of first if ends in II
          const changeFirstsql = 'UPDATE cash_game_listings SET Name = ? WHERE = ?';
          const firstOriginalName = newCashGameInfo[0].substring(0, newCashGameInfo[0].length - 3);
          const dataChangeFirst = [firstOriginalName + " I", firstOriginalName];
          dbPokerListings.query(changeFirstsql, dataChangeFirst, (err, results)=>{
            if (err) {
              throw err;
            }
          })  
        }
        
        //send new cash game info from newCashGame.html via socket.io to main.js for approval DONE
        //send back to sender then to it's main.js then to cashGameTable browserWindow that was just created DONE
        //emit a message to server from the browserWindow where you specify room
        //creates room with approved table name and connected user is now in that room
        
        //send to sender's newCashGame 
        socket.emit('Create cashGameWindow for sender via Socket', newCashGameInfo);                  
               
      }
    })  
  })
  //MAKE IT SO NEWGAMEINFO FOR SNG AND TOURNAMENTS ARE IDENTICAL EVEN IF FIRST VALUE IS BLANK FOR SNGS
  socket.on('create new Tournament', (e, newTournamentInfo, validNameBool = nameVerification(newTournamentInfo, 'tournament')) =>{  
    if (validNameBool){
      createCashGameWindow.close();
      createCashGameWindowBoolean = true;
  
      cashGameWindows.push([newCashGameInfo[0], new BrowserWindow({ width: 800, height: 600, backgroundColor: '#AA0120', show: false, center:true, webPreferences: {nodeIntegration: true}})]);   
    
      let idx = cashGameWindows.length - 1;
      
      //cashGameWindows[idx][1].loadURL("http://localhost:3000/bareby")
        //path.join(__dirname, 'cashGameTable.html'))
      
      cashGameWindows[idx][1].webContents.once('dom-ready', () => {
  
        //how to make sure userBalance constantly updated in main and in server?
        //when you login, username and balance are retrieved from some place where you verify username's pass is correct
        
        //create table then make sure listing added to lobby PROPERLY
        //what if username and userBalance null?
        //above should include what type of cash game listing like nlheCash, plheCash, etc.
  
  
        //newCashGameInfo: [nameOfTable, gameType, limitType, stakesType, numOfPlayers]
  
        lobbyWindow.send('lobby: add listing', ['cash', newCashGameInfo]);//make text nodes in lobbyWindow then it'll post listing
  
        cashGameWindows[idx][1].show();
  
        //sort first element of two element array inside array alphabetically
        ascendingWindows(cashGameWindows);
      })
    }  
  })
  socket.on('create new Sit & Go', (e, newSnGInfo, validNameBool = nameVerification(newSnGInfo, 'sng')) =>{})    
   
  socket.on('Create room for new Cash', (newCashGameInfo) =>{
      //emit a message to server from the browserWindow where you specify room
      //creates room with approved table name and connected user is now in that room

      //let a = new CashGame(newCashGameInfo[0], newCashGameInfo[1], 
        //newCashGameInfo[2], newCashGameInfo[3], newCashGameInfo[4], ['bar3by', 15]);
      //console.log(a.blinds);
      socket.join(newCashGameInfo[0]);//person who created cash game creates cash game room and is first join it 

      io.to(newCashGameInfo[0]).emit("Join room for existing Cash", ); //send data to create cash game on client side for existing
  })
})


//create account window and login window can't be opened at same time 

//MAKE SURE IF LOGIN/REGISTER WINDOW OPEN, LOBBY NON RESPONSIVE AND BLURRED
function openWindow (windowType, regStr){
  if (regStr == 'link'){
    accountWindow.loadURL(path.join(__dirname, windowType + '.html'))  
  }
  else{//button 
    accountWindow =  new BrowserWindow({ width: 800, height: 400, backgroundColor: '#FF0000', parent: lobbyWindow, show: false, center:true, webPreferences: {nodeIntegration: true}})
    accountWindow.loadURL(path.join(__dirname, windowType + '.html'))

    accountWindow.once('ready-to-show', () => {
      accountWindow.show() 
    })
  }
}

//make sure only registration window or login window open 1 at a time, NOT BOTH LIKE THE WAY IT'S SET UP NOW
ipcMain.on('open Registration Window',(e, regStr)=>{
  openWindow('register', regStr)
})

ipcMain.on('open Login Window',(e, loginStr)=>{
  openWindow('login', loginStr)
})

function getValueFromDB(sqlStr, dbVar){
  return new Promise((resolve, reject)=>{
    dbVar.query(sqlStr, (err, results)=>{
      if(err){
         reject(err);
      }
       resolve (results);
    })
  })
}
function checkEmptyReturnVal(resultsArr){
  if (resultsArr.length == 0){
    return (resultsArr);
  }
  else{
    return Object.values(JSON.parse(JSON.stringify(resultsArr[0])));
  }
}

ipcMain.on('register', (e, registerInfo) =>{
  /*
  const dbUsers = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'masuda',
    database: 'usernames'
  })
  dbUsers.connect((err)=>{
    if(err) {
      throw err;
    }
  })
  */
  let sqlEmail = "SELECT Email FROM useraccountsinfo WHERE Email = " + dbUsers.escape(registerInfo.email) ;
  let sqlUser = "SELECT Username FROM useraccountsinfo WHERE Username = " +  dbUsers.escape(registerInfo.username);
  
  let emailPromise = getValueFromDB(sqlEmail, dbUsers);
  let userPromise = getValueFromDB(sqlUser, dbUsers);
  Promise.all([emailPromise, userPromise]). then(results => {
    let emailQueryResults = checkEmptyReturnVal(results[0]);
    let userQueryResults = checkEmptyReturnVal(results[1]);
    
    return [emailQueryResults, userQueryResults];
  })
  .then(async (queryResultsArr) =>{
    const emailQuerySz = queryResultsArr[0].length;
    const userQuerySz = queryResultsArr[1].length;

    if ((emailQuerySz == 0) && (userQuerySz == 0)){
      try {
        const hashedPassword = await bcrypt.hash(registerInfo.password, 10)
        registerInfo.password = hashedPassword
        const post = {Email:registerInfo.email, Username:registerInfo.username, Password:registerInfo.password, Balance:0.00}
        const sql = 'INSERT INTO useraccountsinfo SET ?'
        dbUsers.query(sql, post, (err)=>{
          if (err) {
            throw err;
          }
        })  

        username = registerInfo.username;
        userBalance = 0.00;
        lobbyWindow.send('lobby: logged in user', username);
        accountWindow.close()
      } 
      catch(e) {      
        accountWindow.send('Registration error', e)  
      }
    }
    else if ((emailQuerySz != 0)){    
      accountWindow.send('Registration error', 'Email already registered!')
    }
    else{
      accountWindow.send('Registration error', 'Username already registered!')
    }
  })
  .catch(e => {
    accountWindow.send('Registration error', e)  
  })  
})

//set up rememberMeBool, autoLoginBool here whether it'd be true or false
ipcMain.on('login', (e, loginInfo) =>{//async in front e,logininfo
  /*
  const dbUsers = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'masuda',
    database: 'usernames'
  })
  
  dbUsers.connect((err)=>{
    if(err) {
      throw err;
    }
  })
  */
  //find number of rows in table
  let sqlNumUsers = 'SELECT COUNT(*) FROM useraccountsinfo';

  getValueFromDB(sqlNumUsers, dbUsers).then(rowCount => {
    return Object.values(JSON.parse(JSON.stringify(rowCount[0])));
  })
  .then(numUsersQuery =>{
    if(numUsersQuery !== 0){
      let sqlUserInfo = "SELECT Username, Password, Balance FROM useraccountsinfo WHERE Username = " + dbUsers.escape(loginInfo.username);
      
      getValueFromDB(sqlUserInfo, dbUsers).then(userInfo =>{ 
        return checkEmptyReturnVal(userInfo);
      })
      .then(async (userInfoArr) =>{
        if(userInfoArr.length != 0){
          if(await bcrypt.compare(loginInfo.password, userInfoArr[1])) {
            
            username = loginInfo.username//sent username to CashGame and Tournament/TournamentGame for Player object
            userBalance = userInfoArr[2];
            lobbyWindow.send('lobby: logged in user', username);
            accountWindow.close()
          } 
          else {
            accountWindow.send('Login error', "Wrong Password")
          }
        }
        else{//no such user exists        
          accountWindow.send('Login error', 'Cannot find user')
        }
      }) 
      .catch((e) => {
        console.log("error inside")
        accountWindow.send('Login error', e)
      })  
    }
    else{//empty user database
        accountWindow.send('Login error', 'Cannot find user')
    }
  })   
  .catch((e) => {
    accountWindow.send('Login error', e)
  })  
})
ipcMain.on('logout', ()=>{
  username = null;
  userBalance = null;
})


ipcMain.on('open Cashier Window', ()=>{
  if (cashierWindowBoolean){
    cashierWindow =  new BrowserWindow({ width: 800, height: 400, backgroundColor: '#87CEFA', show: false, center:true, webPreferences: {nodeIntegration: true}})
    cashierWindow.loadURL(path.join(__dirname, 'cashier.html'))

    cashierWindow.once('ready-to-show', () => {
      //cashierWindow.send('update: User Cashier Info', [[username, userBalance, userInfo]])
      cashierWindow.show()
      cashierWindowBoolean = false
    })
  }
  else {//when false that means window is opened, so it just focuses it whether it's already focused or not
    cashierWindow.focus()   
  }
})

ipcMain.on('open Deposit Window', ()=>{
  //probably copy and pasted below with the intention of changing it but never got to it
  if (cashierWindowBoolean){
    depositWindow =  new BrowserWindow({ width: 800, height: 400, backgroundColor: '#87CEFA', show: false, center:true, webPreferences: {nodeIntegration: true}})
    depositWindow.loadURL(path.join(__dirname, 'cashier.html'))

    depositWindow.once('ready-to-show', () => {
      depositWindow.send('update: User Cashier Info', [[username, userBalance, address]])
      depositWindow.show()
      depositWindowBoolean = false
    })
  }
  else {
    depositWindow.focus()   
  }
})

ipcMain.on('open Create Cash Window',()=>{

  //creates new automatically when you press button
  if (createCashGameWindowBoolean){
    createCashGameWindow =  new BrowserWindow({ width: 525, height: 475, show: false, resizable: false, center:true, webPreferences: {nodeIntegration: true}})
    createCashGameWindow.loadURL(path.join(__dirname, 'newCashGame.html'))

    createCashGameWindow.once('ready-to-show', () => {
      createCashGameWindow.show()
      createCashGameWindowBoolean = false
    })
  }
  else {//createCashGameWindow already created
    if(hiddenCashGameWindow){
      hiddenCashGameWindow = false;
      createCashGameWindow.show();  
    }
    else{//not hidden
      createCashGameWindow.focus();  
    }
    
  }
  createCashGameWindow.on('close', () =>{
    createCashGameWindowBoolean = true;
    hiddenCashGameWindow = false;
  });
})
ipcMain.on('open Create Tournament Window',()=>{
  //creates new automatically when you press button
  if (createTournamentWindowBoolean){
    createTournamentWindow =  new BrowserWindow({ width: 800, height: 400, show: false, resizable: false, center:true, webPreferences: {nodeIntegration: true}})
    createTournamentWindow.loadURL(path.join(__dirname, 'newTournament.html'))

    createTournamentWindow.once('ready-to-show', () => {
      createTournamentWindow.show()
      createTournamentWindowBoolean = false
    })
  }
  else {
    createTournamentWindow.focus()   
  }
  createTournamentWindow.on('close', () =>{
    createTournamentWindowBoolean = true;
  });
})
ipcMain.on('open Create SnG Window',()=>{
  //creates new automatically when you press button
  if (createSnGWindowBoolean){
    createSnGWindow =  new BrowserWindow({ width: 800, height: 400, show: false, resizable: false, center:true, webPreferences: {nodeIntegration: true}})
    createSnGWindow.loadURL(path.join(__dirname, 'newSitNGo.html'))

    createSnGWindow.once('ready-to-show', () => {
      createSnGWindow.show()
      createSnGWindowBoolean = false
    })
  }
  else {
    createSnGWindow.focus()   
  }
  createSnGWindow.on('close', () =>{
    createSnGWindowBoolean = true;
  });
})

ipcMain.on("Create cashGame with size and stakes input", (e, szStakesArr) =>{
  sampleGame.close();
  cashGameWindows.push(['barebe', new BrowserWindow({backgroundColor: '#AA0120', show: false, center:true, webPreferences: {nodeIntegration: true}})]);     
  
  let idx = cashGameWindows.length - 1;
  cashGameWindows[idx][1].loadURL(path.join(__dirname, "cashGameTable.html"));   
  cashGameWindows[idx][1].webContents.on('did-finish-load', () => {
    cashGameWindows[idx][1].send('create sample cashGame', szStakesArr); 
  }) 

  cashGameWindows[idx][1].once('ready-to-show', () => {            
      //newCashGameInfo: [nameOfTable, gameType, limitType, stakesType, numOfPlayers]
    //console.log('not working inside');
    cashGameWindows[idx][1].maximize();
    cashGameWindows[idx][1].show();    
  });
});

//set up so all clients will be creating this cash game listing at the same time as you
ipcMain.on('Add Cash Game listing sent from newCashGame', (e, cashGameInfo) => {
  lobbyWindow.send('lobby: add listing', ['cash', cashGameInfo]); 
});
//sort array in ascending order or is that necessary???
ipcMain.on('create cashGameWindow for sender via main', (e, cashGameInfo) => {
  if(hiddenCashGameWindow){
    createCashGameWindow.close();
    createCashGameWindowBoolean = true;    
  }

  cashGameWindows.push([cashGameInfo[0], new BrowserWindow({ width: 800, height: 600, backgroundColor: '#AA0120', show: false, center:true, webPreferences: {nodeIntegration: true}})]);     
  
  let idx = cashGameWindows.length - 1;
  cashGameWindows[idx][1].loadURL(path.join(__dirname, "cashGameTable.html"));   
  cashGameWindows[idx][1].webContents.on('did-finish-load', () => {
    cashGameWindows[idx][1].send('Create Cash Game', [[username, userBalance], cashGameInfo]); 
  }) 

  cashGameWindows[idx][1].once('ready-to-show', () => {            
      //newCashGameInfo: [nameOfTable, gameType, limitType, stakesType, numOfPlayers]
    //console.log('not working inside');
    cashGameWindows[idx][1].show();    
  });

  setTimeout(() => {
    const post = {Name: cashGameInfo[0], Game: cashGameInfo[1], Limit: cashGameInfo[2], Stakes: cashGameInfo[3], Players: "0/" + cashGameInfo[4], Wait: 0, 'Avg Pot':0,'Plrs/Flop':0, 'H/hr':0}
    const sql = 'INSERT INTO cash_game_listings SET ?'
    dbPokerListings.query(sql, post, (err)=>{
      if (err) {
        throw err;
      }
    });
  }, 300);  

  //sends to all users connected which then sends back to main (but this sends it back to newCashGame which might not always be opened)
  io.sockets.emit('Add Cash Game listing via Socket', cashGameInfo); 
});

function getNextRomanNumeral(counter){
  if (counter == 1){
    return " II";
  }
  else if (counter == 2){
    return " III";
  }
  else if (counter == 3){
    return " IV";
  }
}

//check for repeats in nameVerification from database!!!!!!!!!!!!!!!(important here)
function nameVerification (newGameInfo, type, alreadyDone){

  if (alreadyDone){
    return new Promise((resolve, reject) => {
       resolve (true);
    });
  }
  newGameInfo[0] = capitalizeLetters(newGameInfo[0]);

  if(type == 'cash'){
    return cashGameVerification(newGameInfo);    
  }
  else if (type == 'tournament'){
    return tournamentVerification(newGameInfo);
  }
  else{
    return sngVerification(newGameInfo);
  }
}

//not picking up second element in cashGameWindows because you have greater sign as conditional
async function cashGameVerification(newGameInfo){  
  //what if array is 0? change it so it takes array.length = 0 into account
  
  //find number of cash game listings
  let sqlNumListings = 'SELECT COUNT(*) FROM cash_game_listings';
  
  return await getValueFromDB(sqlNumListings, dbPokerListings).then(async (numCashListingsArr) => {

    let numCashListings = Object.values(JSON.parse(JSON.stringify(numCashListingsArr[0])))[0];

    if (numCashListings == 0){//empty database
      return  new Promise((resolve, reject) => {
         resolve (true);
      });
    }  

    const repeatsVarStr =  dbPokerListings.escape(newGameInfo[0]).substring(1, newGameInfo[0].length + 1);
    let sqlNameRepeats = "SELECT Name FROM cash_game_listings WHERE Name REGEXP '" +
    repeatsVarStr + "( I{0,3}|| IV{0,1})$'"; //find number of repeats with names that begin with string above

    return await getValueFromDB(sqlNameRepeats, dbPokerListings).then((nameRepeatsArr) => {
      
      let nameRepeats = [];
      for (let i = 0; i < nameRepeatsArr.length; i++){
        nameRepeats.push(Object.values(JSON.parse(JSON.stringify(nameRepeatsArr[i])))[0]);
      }
      const numRepeats = nameRepeats.length;
      
      if(numRepeats == 0){//true so you can insert from outside of here
        return  new Promise((resolve, reject) => {
          resolve (true);
        });
      }
      else if(numRepeats == 1){//ask for approval of name then if yes update 1st with I in end & add name with II
        //ask for approval of name change with II at end then change first to end with I and insert new name
        createCashGameWindow.send('new Table Name', [newGameInfo[0] + ' II', newGameInfo], true); 
        return  new Promise((resolve, reject) => {
          resolve (false);
        });
      }
      else{//ask for approval of name change before you can insert into database, don't have change other names
        createCashGameWindow.send('new Table Name', [newGameInfo[0] + ' ' + getNextRomanNumeral(numRepeats), newGameInfo]); 
        return  new Promise((resolve, reject) => {
          resolve (false);
        });
      }
    })
  })
  .catch(err =>{
    if (err){
      throw err;
    }
  })
}
async function tournamentVerification(newGameInfo){
  if (tournamentWindows.length == 0){
    return true;
  }
  for (let i = 0; i < tournamentWindows.length; i++){
    if(tournamentWindows[i][0].slice(0, newGameInfo[0].length - 1) == newGameInfo[0]){//match
      createTournamentWindow.send('Tournament Name Failure');
      break;
    }
    if(i == tournamentWindows.length -1){
      createTournamentWindow.send('Tournament Name Success');
    }
  }
}
async function sngVerification(newGameInfo){
  if (sngWindows.length == 0){
    return true;
  }
  for (let i = 0; i < sngWindows.length; i++){
    if(sngWindows[i][0].slice(0, newGameInfo[0].length - 1) == newGameInfo[0]){//match
      createSnGWindow.send('SnG Name Failure');
      break;
    }
    if(i == sngWindows.length -1){
      createSnGWindow.send('SnG Name Success');
    }
  }
}
//make sure roman numerals never allowed in input and lookbehind there are no roman numerals behidn that too

function capitalizeLetters(inputString){
  const firstLetter = inputString.match(/^[a-z]/);
  if (firstLetter != null){
    inputString = inputString.replace(/^[a-z]/, firstLetter[0].toUpperCase());
  }
  const lettersAfterSpace = inputString.match(/(?<=\s{1})[a-z]/g)
  if (lettersAfterSpace != null){
    for (let i = 0; i < lettersAfterSpace.length; i++){
      inputString = inputString.replace(/(?<=\s{1})[a-z]/, lettersAfterSpace[i].toUpperCase());
    }
  }

  return inputString;
}


   
//MAKE SURE BELOW WORKS!!!
function ascendingWindows(windowArr){
  windowArr.sort(function(a, b) {//descending order
    return a[0] - b[0]; //so a[0] - b[0] is ascending then
  });
}                                                                                 
    
function listingsDivName(gameType, limitType, listingFormat){
  if (gameType == "Hold'Em"){
    if(limitType == "No Limit"){
      return 'nlhe' + listingFormat;
    }
    else if (limitType == "Pot Limit"){
      return 'plhe' + listingFormat;
    }
    else{
      return 'flhe' + listingFormat;
    }
  }
  else if (gameType == "Omaha"){
    return 'omaha' + listingFormat;
  }
  else if (gameType == "Omaha Hi/Lo"){
    return 'omahaHiLo' + listingFormat;
  }
  else if (gameType == "7 Card Stud"){
    return 'stud' + listingFormat;
  }
  else if (gameType == "7 Card Stud Hi/Lo"){
    return 'studHiLo' + listingFormat;
  }
  else{//Razz
    return 'razz' + listingFormat;
  }  
}


//enable double click in gui to access route for html and then load that to browserWindow
//all open browserWindows are stored in array
//if browerWindow is closed and it's cash game but you're in middle of hand and timer still going off 
      //or tournament/sng you're still in


//double click listing in lobby
ipcMain.on("open listing", ()=>{})

/*
const dbPokerListings = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'masuda',
  database: 'poker listings'
})

dbPokerListings.connect((err)=>{
  if(err) {
    throw err;
  }
})
*/
ipcMain.on('lobby: update balance',()=>{})

ipcMain.on('lobby update listing',(e, updateInfo)=>{

  //sent direct from table.js or whatever js you decide to label aftwards for cash
  //sent direct from tournament or sng lobby

  //['cash', [nameOfTable, gameType, limitType], [numPlayers, numWait, avgPot, plrsFlop, hHour]]
  //['tournament', [Date, Name, gameType, limitType], [state, enrolled]]
  //['sng', [Name, gameType, limitType], [state, enrolled]]

  if (updateInfo[0] == 'cash'){
    const listingsDiv = listingsDivName(updateInfo[1][1], updateInfo[1][2], 'Cash');

    lobbyWindow.send('lobby: update listing', ['cash', listingsDiv, updateInfo[1][0], updateInfo[2]]);
  }
  else if (updateInfo[0] == 'tournament'){
    const listingsDiv = listingsDivName(updateInfo[1][2], updateInfo[1][3], 'Tournament');
    
    lobbyWindow.send('lobby: update listing', ['tournament', listingsDiv, [updateInfo[1][0], updateInfo[1][1]], updateInfo[2]]);
  }
  else{
    const listingsDiv = listingsDivName(updateInfo[1][1], updateInfo[1][2], 'SnG');
    
    lobbyWindow.send('lobby: update listing', ['sng', listingsDiv, updateInfo[1][0], updateInfo[2]]);
  }  
})

ipcMain.on('close Cash Game after creation', (e, cashGameName) =>{
  for (let i = 0; i < cashGameWindows.length; i++){
    if(cashGameWindows[i][0] == cashGameName){
      //cashGameWindows[i][1].close();
      //cashGameWindows.splice(i, 1);
    }
  }
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () =>{console.log('hi');});