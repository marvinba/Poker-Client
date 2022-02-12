const electron = require('electron');
const path = require('path');
const fs = require('fs');
const { Socket } = require('socket.io');

const {ipcRenderer} = electron;

let username, registrationWindow, loginWindow, userBalance;
let autoLoggedBoolVal;
let lastUsedSetting;

showButtonsLoggedIn(false);

document.getElementById('createNewGroup').style.visibility = "visible"; //testing only to see create Buttons fuctionality

//create account, login, log off buttons and their functions when cicked
document.getElementById('createAccountBtn').addEventListener('click',createAcctFunc);
document.getElementById('loginBtn').addEventListener('click',loginFunc);
document.getElementById('logoutBtn').addEventListener('click',logoutFunc);

//when you click new tournament, sng, and cash game buttons
document.getElementById('createNewCashGame').addEventListener('click', createCash);
document.getElementById('createNewTournament').addEventListener('click',createTournament);
document.getElementById('createNewSnG').addEventListener('click',createSnG);

//when you click gameFormat (i.e. cash game, tournament, n sng)
document.getElementById('cashGame').addEventListener('click', ()=>{showCashGameListings()});
document.getElementById('tournament').addEventListener('click', showTournyListings);
document.getElementById('sng').addEventListener('click', showSnGListings);

//when you click game in game table
document.getElementById("holdemGame").addEventListener('click', holdEmChosenGame);
document.getElementById("omahaGame").addEventListener('click', omahaChosenGame);
document.getElementById("studGame").addEventListener('click', studChosenGame);

//when you click limit/type
document.getElementsByClassName("limitsTypes")[0].getElementsByTagName("td")[0].addEventListener('click', firstRowChosenLimit);
document.getElementsByClassName("limitsTypes")[1].getElementsByTagName("td")[0].addEventListener('click', secondRowChosenLimit);
document.getElementsByClassName("limitsTypes")[2].getElementsByTagName("td")[0].addEventListener('click', thirdRowChosenLimit);

//when you click stakes
document.getElementById('allStakes').addEventListener('click', allStakesChosen);
document.getElementById('highStakes').addEventListener('click', highStakesChosen);
document.getElementById('mediumStakes').addEventListener('click', mediumStakesChosen);
document.getElementById('lowStakes').addEventListener('click', lowStakesChosen);
document.getElementById('microStakes').addEventListener('click', microStakesChosen);

//when you click size
document.getElementById('allSizes').addEventListener('click', allSizesChosen)
document.getElementById('twoMax').addEventListener('click', twoMaxChosen)
document.getElementById('sixMax').addEventListener('click', sixMaxChosen)
document.getElementById('eightMax').addEventListener('click', eightMaxChosen)
document.getElementById('nineMax').addEventListener('click', nineMaxChosen)

let settingsText = fs.readFileSync('./Button Settings.txt', 'utf-8');
//.toString(); //what constant if buttonSettings changing?
const strPattern = '\\[\\[\".*\\]\\]';
const matchRegex = new RegExp(strPattern);
lastUsedSetting = JSON.parse(settingsText.match(matchRegex)[0]);

//shows correct limitType
for (let i = 0; i < 3; i++){
  for (let j = 0; j < 3; j++){
    if (j == convertGameToTblIdx(lastUsedSetting[0][1])){
      document.getElementsByClassName("limitsTypes")[i].getElementsByTagName("p")[j].style.display = "flex";
    }
    else{
      document.getElementsByClassName("limitsTypes")[i].getElementsByTagName("p")[j].style.display = "none";
    }
  }
}

function showButtonsLoggedIn(loggedInBool){
  if (!loggedInBool){//not logged in yet  
    document.getElementById('accountBtnGroupNotLoggedin').setAttribute("class", "accountBtnsShow");
    document.getElementById('accountBtnGroupLoggedin').setAttribute("class", "accountBtnsHide");    
  }
  else{//logged in(should you use lobby: Logged in user only instead of this????
    document.getElementById('accountBtnGroupLoggedin').setAttribute("class", "accountBtnsShow");
    document.getElementById('accountBtnGroupNotLoggedin').setAttribute("class", "accountBtnsHide");  

    //createNewGroup always hidden unless admin logged in
    if (username == 'admin'){
      document.getElementById('createNewGroup').style.visibility = "visible";
    }
  }
}
ipcRenderer.on('lobby: logged in user', (e,userNick) =>{
  //userInfo is [username, userBalance]
  username = userNick;
  showButtonsLoggedIn(true, username);  
})

//user not logged in unless auto logged in (main always sends right before lobby window)
ipcRenderer.on('lobby: Auto Logged In',(e,loginInfo)=>{
  //[autoLoggedBool, username, userBalance]
  autoLoggedBoolVal = loginInfo[0];

  //showButtonsLoggedIn(loginInfo[0])
}); 

//Socket.on('lobby: load database listings')
  //has players in entrants/sz
  
ipcRenderer.on('lobby: add listing', (newGameInfo) =>{     
  //['cash', newCashGameInfo]    
  //newCashGameInfo: [nameOfTable, gameType, limitType, stakesType, numOfPlayers]
  
  if (newGameInfo[0] == 'cash'){
    const cashGameListing = document.createElement("LI");

    addNodesToListing(cashGameListing, 'cash', newGameInfo[1]);
    addListingToDiv(cashGameListing, 'Cash', newGameInfo[1][1], newGameInfo[1][2]);
  }
  else if (newGameInfo[0] == 'tournament'){
    const tournamentListing = document.createElement("LI");

    addNodesToListing(cashGameListing, 'tournament', newGameInfo[1]);
    addListingToDiv(tournamentListing, 'Tournament', newGameInfo[1][1], newGameInfo[1][2]);
  }
  else{//sng
    const sngListing = document.createElement("LI");

    addNodesToListing(cashGameListing, 'sng', newGameInfo[1]); 
    addListingToDiv(sngListing, 'SnG', newGameInfo[1][1], newGameInfo[1][2]);
  }
})

ipcRenderer.on('lobby: update listing', (updateListingInfo)=>{
 
  const divListings = document.getElementById(updateListingInfo[1]).getElementsByTagName("li");

  if (updateListingInfo[0] == 'cash'){
    for (let i = 0; i < divListings.length; i++){
      if (divListings[i].childNodes[0].nodeValue == updateListingInfo[2]){//name textNode 0     

        //UpdateInfo: ['cash', [nameOfTable, gameType, limitType], [numPlayers, numWait, avgPot, plrsFlop, hHour]]
        //['cash', listingsDiv, updateInfo[1][0], updateInfo[2]];

        //gameLimitNode 1
        //gameStakes 2

        divListings[i].childNodes[3].nodeValue = updateListingInfo[3][0]; //numPlayers 3
        divListings[i].childNodes[4].nodeValue = updateListingInfo[3][1]; //Wait 4
        divListings[i].childNodes[5].nodeValue = updateListingInfo[3][2]; //Avg Pot 5
        divListings[i].childNodes[6].nodeValue = updateListingInfo[3][3]; //Plrs/Flop 6
        divListings[i].childNodes[7].nodeValue = updateListingInfo[3][4]; //H/hr 7
      }     
    } 
  }
  else if (updateInfo[1] == 'tournament'){
    for (let i = 0; i < divListings.length; i++){
      if ((divListings[i].childNodes[0].nodeValue == updateListingInfo[2][0])
         && (divListings[i].childNodes[1].nodeValue == updateListingInfo[2][1])){//date and name nodes 0 1 resp.     
  
        //UpdateInfo: ['tournament', [Date, Name, gameType, limitType], [state, enrolled]]
        //['tournament', listingsDiv, [updateInfo[1][0], updateInfo[1][1]], updateInfo[2]]);

        //Date 0 
        //Name 1
        //Size 2
        //Game 3 
        //Buy&#8209In 4  
        //Speed     5
        //State 6
        //Enrolled 7

        divListings[i].childNodes[6].nodeValue = updateListingInfo[3][0]; //State 5
        divListings[i].childNodes[7].nodeValue = updateListingInfo[3][1]; //Enrolled 6
      }     
    } 
  }
  else{//sng    
    //UpdateInfo: ['sng', [Name, gameType, limitType], [state, enrolled]]
    //['sng', listingsDiv, updateInfo[1][0], updateInfo[2]];

    //Name 0
    //Game 1
    //Buy&#8209In 2  
    //Speed     3
    //State 4
    //Enrolled 5
    
    for (let i = 0; i < divListings.length; i++){
      if (divListings[i].childNodes[0].nodeValue == updateListingInfo[2]){//Name node 0

        divListings[i].childNodes[4].nodeValue = updateListingInfo[3][0]; //State 4
        divListings[i].childNodes[5].nodeValue = updateListingInfo[3][1]; //Enrolled 5
      }
    }
  }
})

function createAcctFunc(){
  ipcRenderer.send('open Registration Window', 'button');
}
function loginFunc(){
  ipcRenderer.send('open Login Window', 'button');
}
function logoutFunc(){
  username = null;
  ipcRenderer.send('logout');
  showButtonsLoggedIn(false);
}

//have to open browserWindow in main not window.open here  
function createCash(){
  ipcRenderer.send('open Create Cash Window')
}
function createTournament(){
  ipcRenderer.send('open Create Tournament Window')
}
function createSnG(){
  ipcRenderer.send('open Create SnG Window')
}

showCashGameListings(true);//doesn't need to show correct limitType since you did that in beginning of code

function convertGameToTblIdx(gameStr){
  if (gameStr == "Hold'em"){
    return 0;
  }
  else if (gameStr == "Omaha"){
    return 1;
  }
  else{
    return 2;
  }
}
function convertLimitTypeToTblIdx(limitTypeStr){
  if (limitTypeStr == "No Limit"){
    return 0;
  }
  else if (limitTypeStr == "Pot Limit"){
    return 1;
  }
  else if (limitTypeStr == "Fixed Limit"){
    return 2;
  }
  else if (limitTypeStr == "Omaha"){
    return 0;
  }
  else if (limitTypeStr == "Omaha Hi/Lo"){
    return 1;
  }
  else if (limitTypeStr == "7 Card Stud"){
    return 0;
  }
  else if (limitTypeStr == "7 Card Stud Hi/Lo"){
    return 1;
  }
  else {// "Razz"
    return 2;
  }
}
function convertStakesToTblIdx(stakesStr){
  if (stakesStr == "All"){
    return 0;
  }
  else if (stakesStr == "High"){
    return 1;
  }
  else if (stakesStr == "Medium"){
    return 2;
  }
  else if (stakesStr == "Low"){
    return 3;
  }
  else{//"Micro"
    return 4;
  }
}
function convertSizeToTblIdx(sizeStr){    
  if (sizeStr == "All"){
    return 0;
  }
  else if (sizeStr == "2-Max (Heads Up)"){
    return 1;
  }
  else if (sizeStr == "6-Max"){
    return 2; 
  }
  else if (sizeStr == "8-Max"){
    return 3;
  }
  else{//"9-Max"
    return 4;
  }
}

function showHideLimitTypes(gameIdx){
  for (let i = 0; i < 3; i++){
    for (let j = 0; j < 3; j++){
      if (j == gameIdx){
        document.getElementsByClassName("limitsTypes")[i].getElementsByTagName("p")[j].style.display = "flex";
      }
      else{
        document.getElementsByClassName("limitsTypes")[i].getElementsByTagName("p")[j].style.display = "none";
      }
    }
  }
}

function changeFormatButtonsColor(formatIndex, bypassBoolean = false){
  if (!bypassBoolean){
    for (let i = 0; i < 3; i++){
      if (i == formatIndex){
        document.getElementById("formatChoice").getElementsByTagName
        ("button")[i].setAttribute("class", "selectedFormat");

        document.getElementById("listings-organizer").getElementsByTagName
        ("div")[i].style.display = 'flex';
      }
      else{
        document.getElementById("formatChoice").getElementsByTagName
        ("button")[i].removeAttribute("class");

        document.getElementById("listings-organizer").getElementsByTagName
        ("div")[i].style.display = 'none';
      }      
    }
  }
}
function changeGameButtonsColor(clickedIdx){
  for (let i = 0; i < 3; i++){
    if (i != clickedIdx){
      document.getElementById("game").getElementsByTagName('tr')[i + 1].removeAttribute("id");
    }
    else{
      document.getElementById("game").getElementsByTagName('tr')[i + 1].setAttribute("id", "selected");
    }
  }
}
function changeLimitTypeBtnsColor(clickedIdx){
  for (let i = 0; i < 3; i++){
    if (i != clickedIdx){
      document.getElementsByClassName("limitsTypes")[i].removeAttribute("id");
    }      
    else{
      document.getElementsByClassName("limitsTypes")[i].setAttribute("id", "selected");
    }  
  }
}
function changeStakesBtnsColor(clickedIdx){
  for (let i = 0; i < 5; i++){    
    if (i != clickedIdx){
      document.getElementById("stakes").getElementsByTagName('tr')[i + 1].removeAttribute("id");
    }
    else{
      document.getElementById("stakes").getElementsByTagName('tr')[i + 1].setAttribute("id", "selected");
    }
  }
}
function changeSzButtonsColor(clickedIdx){
  for (let i = 0; i < 5; i++){
    if (i != clickedIdx){
      document.getElementById("size").getElementsByTagName('tr')[i + 1].removeAttribute("id");
    }
    else{
      document.getElementById("size").getElementsByTagName('tr')[i + 1].setAttribute("id", "selected");
    }
  }
}

function convertGameLimitTypeToListing(gameStr, limitTypeStr, listingFormat){
  if (gameStr == "Hold'em"){
    if (limitTypeStr == "No Limit"){
      return [0, 'nlhe' + listingFormat];
    }
    else if (limitTypeStr == "Pot Limit"){
      return [1, 'plhe' + listingFormat];
    }
    else{//Fixed Limit
      return [2, 'flhe' + listingFormat];
    }
  }
  else if (gameStr == "Omaha"){
    if (limitTypeStr == "Omaha"){
      return [3, 'omaha' + listingFormat];
    }
    else{//Omaha Hi/Lo
      return [4, 'omahaHiLo' + listingFormat] ;
    }
  }
  else{//stud
    if (limitTypeStr == "7 Card Stud"){
      return [5, 'stud' + listingFormat];
    }
    else if (limitTypeStr == "7 Card Stud Hi/Lo"){
      return [6, 'studHiLo' + listingFormat];
    }
    else{//Razz
      return [7, 'razz' + listingFormat];
    }
  }
}

function showHideListings(listingIndices){  //hide and show correct format listings  
  for (let i = 0; i < 8; i++){
    if (i < 3){
      if (i == listingIndices[0]){         
        document.getElementsByClassName("formatListings")[i].setAttribute("id", "visibleListings");
      }
      else{
        document.getElementsByClassName("formatListings")[i].setAttribute("id", "hiddenListings");
      } 
    }
    
    if (i != listingIndices[1]){
      document.getElementsByClassName("formatListings")[listingIndices[0]].getElementsByTagName("div")[i].setAttribute("id", "hiddenListings");
    }
    else{
      document.getElementsByClassName("formatListings")[listingIndices[0]].getElementsByTagName("div")[i].setAttribute("id", "visibleListings");
    }
  }
}

//nodes different for cash games, tournaments, n sngs
function filterStakes(stakesStr, currentLI, formatStr){     
    let minRangeHigh;
    let minRangeMedium;
    let maxRangeMedium;
    let minRangeLow;
    let maxRangeLow;
    let minRangeMicro;
    let maxRangeMicro;

    let sbOrSame, bbOrSame;

  if (formatStr == "Cash"){//2 stakes
    minRangeHigh = 5;
    minRangeMedium = 1;
    maxRangeMedium = 6;
    minRangeLow = 0.25;
    maxRangeLow = 1;
    minRangeMicro = 0.01;
    maxRangeMicro = 0.25;
    
    const blinds = currentLI.childNodes[2].nodeValue;
    sbOrSame = parseFloat(blinds.match(/\d+\.*\d*(?=\/)/));
    bbOrSame = parseFloat(blinds.match(/(?<=\/\$)\d+\.*\d*/));  
  }
  else if (formatStr == "Tournament"){//3 buyin
    minRangeHigh = 104.50;
    maxRangeHigh = 2650;
    minRangeMedium = 21;
    maxRangeMedium = 95;
    minRangeLow = 5.25;
    maxRangeLow = 20;
    minRangeMicro = .10;
    maxRangeMicro = 4.40;

    const buyInPlusFee = currentLI.childNodes[3].nodeValue;
    const buyIn = parseFloat(buyInPlusFee.match(/\d+\.*\d*(?=\s\+)/));
    const buyInFee = parseFloat(buyInPlusFee.match(/(?<=\s\+\s\$)\d+\.*\d*/));
    sbOrSame = buyIn + buyInFee;
    bbOrSame = sbOrSame;
  }
  else{//2 buyin
    minRangeHigh = 103.70;
    maxRangeHigh = 215;
    minRangeMedium = 21;
    maxRangeMedium = 88;
    minRangeLow = 5.30;
    maxRangeLow = 15.80;
    minRangeMicro = 0.55;
    maxRangeMicro = 3.30;

    const buyInPlusFee = currentLI.childNodes[2].nodeValue;
    const buyIn = parseFloat(buyInPlusFee.match(/\d+\.*\d*(?=\s\+)/));
    const buyInFee = parseFloat(buyInPlusFee.match(/(?<=\s\+\s\$)\d+\.*\d*/));
    sbOrSame = buyIn + buyInFee;
    bbOrSame = sbOrSame;
  }

  if (stakesStr == "All"){
    currentLI.style.display = "flex";
  }
  else if (stakesStr == "High"){
    if (sbOrSame >= minRangeHigh){//high
      currentLI.style.display = "flex";
    }
    else{
      currentLI.style.display = "none";
    }        
  }
  else if (stakesStr == "Medium"){
    if ((sbOrSame >= minRangeMedium) &&
    (bbOrSame <= maxRangeMedium)){//medium
      currentLI.style.display = "flex";
    }
    else{
      currentLI.style.display = "none";
    }
  }
  else if (stakesStr == "Low"){
    if ((sbOrSame >= minRangeLow) &&
    (bbOrSame <= maxRangeLow)){//low
      currentLI.style.display = "flex";
    }
    else{
      currentLI.style.display = "none";
    }        
  }
  else {//(stakesStr== "Micro"){
    if ((sbOrSame >= minRangeMicro) &&
    (bbOrSame <= maxRangeMicro)){//micro
      currentLI.style.display = "flex";
    }
    else{
      currentLI.style.display = "none";
    }  
  }
}

function filterSz(szStr, currentLI, formatStr){  
  //cash 3
  //tournament 2
  //sng 5
  let tableSz;  
  if (formatStr == "tournament"){
    tableSz = parseInt(currentLI.childNodes[2].nodeValue);
  }
  else{
    let increment;
    if (formatStr == "cash"){
      increment = 0;  
    }
    else{
      increment = 2;
    }
    tableSz =  parseInt(currentLI.childNodes[3 + increment].nodeValue.match(/(?<=\/)\d+/));
  }

  if (szStr == "All"){
    currentLI.style.display = "flex";
  }
  else if (szStr == "2-Max (Heads Up)"){
    if (tableSz == 2){
      currentLI.style.display = "flex";
    }
    else{
      currentLI.style.display = "none";
    }        
  }
  else if (szStr == "6-Max"){
    if (tableSz == 6){
      currentLI.style.display = "flex";
    }
    else{
      currentLI.style.display = "none";
    }
  }
  else if (szStr == "8-Max"){
    if (tableSz == 8){
      currentLI.style.display = "flex";
    }
    else{
      currentLI.style.display = "none";
    }        
  }
  else {//"9-Max"
    if (tableSz == 9){
      currentLI.style.display = "flex";
    }
    else{
      currentLI.style.display = "none";
    }  
  }
}

//implement so it can be used not only for format, but everything else too

function formatIdx(formatStr){
  if (formatStr == "Cash"){
    return 0;
  }
  else if (formatStr == "Tournament"){
    return 1;
  }
  else{
    return 2;
  }
}
//CHECCCKKKK TO SEE IF BYPASS NECESSARY
function colorAndFilterFormatClick(formatStr, bypassBool = false){
  const firstIdx = formatIdx(formatStr);
  changeFormatButtonsColor(firstIdx);

  const gameIdx = convertGameToTblIdx(lastUsedSetting[firstIdx][1]);
  changeGameButtonsColor(gameIdx);
  showHideLimitTypes(gameIdx);
  changeLimitTypeBtnsColor(convertLimitTypeToTblIdx(lastUsedSetting[firstIdx][2]));  
  changeStakesBtnsColor(convertStakesToTblIdx(lastUsedSetting[firstIdx][3]));
  changeSzButtonsColor(convertSizeToTblIdx(lastUsedSetting[firstIdx][4]));
  
  //shows correct listing and set others to none
  const listingDivNIdx = convertGameLimitTypeToListing(lastUsedSetting[firstIdx][1], lastUsedSetting[firstIdx][2], formatStr);
  showHideListings([firstIdx, listingDivNIdx[0]]); 
  
  //filters listings according to size and stakes now
  const allListings = document.getElementsByClassName(listingDivNIdx[1])[0].getElementsByTagName("li");
  for (let i = 0; i < allListings.length; i++){
    const currentLI = allListings[i];       

    filterStakes(lastUsedSetting[firstIdx][3], currentLI, formatStr);
    filterSz(lastUsedSetting[firstIdx][4], currentLI, formatStr);    
  }
}

function showCashGameListings(bypassBool = false){  
  colorAndFilterFormatClick("Cash", bypassBool);
}
function showTournyListings(){  
  colorAndFilterFormatClick("Tournament");
}
function showSnGListings(){      
  colorAndFilterFormatClick("SnG");
}

function formatCapitalizedNIdx(formatInput){
    if (formatInput == "cashGame"){
      return ["Cash", 0];
    }
    else if (formatInput == "tournament"){
      return ["Tournament", 1];
    }
    else{
      return ["SnG", 2];
    }
}
function gameRegexStr(gameString){
  if (gameString == "Hold'em"){
    return "Hold\'em";
  }
  else{
    return gameString;
  }
}
function loadAndWriteSelectedGame(gameStr, formatStrNIdx){
    
    //load up settings    
    const gameRegex = gameRegexStr(gameStr);
    const regPatternLoad = "\\[\"" + formatStrNIdx[0] + "\"(, |,)\"" + gameRegex + "\",[A-Za-z0-9-,()/\"\' ]*\\]"; //has to be format and game to load up
    const regObjLoad = new RegExp(regPatternLoad);  
    lastUsedSetting[formatStrNIdx[1]] = JSON.parse(settingsText.match(regObjLoad)[0]); //loads to lastUsedSetting

    //then change first line by writing to file
    const newFirstLineSettings  = settingsText.replace(/\[\[\".*\]\]/, JSON.stringify(lastUsedSetting));
    fs.writeFileSync('./Button Settings.txt', newFirstLineSettings, 'utf8', ()=>{});
    settingsText = fs.readFileSync('./Button Settings.txt', 'utf-8'); //loads up new text
}
function colorAndFilterGameClick(formatStrNIdx){  
  const firstIdx = formatStrNIdx[1];
  const gameIdx = convertGameToTblIdx(lastUsedSetting[firstIdx][1]);
  changeGameButtonsColor(gameIdx);
  showHideLimitTypes(gameIdx);
  changeLimitTypeBtnsColor(convertLimitTypeToTblIdx(lastUsedSetting[firstIdx][2]));  
  changeStakesBtnsColor(convertStakesToTblIdx(lastUsedSetting[firstIdx][3]));
  changeSzButtonsColor(convertSizeToTblIdx(lastUsedSetting[firstIdx][4]));
  
  //shows correct listing and set others to none
  const listingDivNIdx = convertGameLimitTypeToListing(lastUsedSetting[firstIdx][1], lastUsedSetting[firstIdx][2], formatStrNIdx[0]);
  showHideListings([firstIdx, listingDivNIdx[0]]); 
  
  //filters listings according to size and stakes now
  const allListings = document.getElementsByClassName(listingDivNIdx[1])[0].getElementsByTagName("li");
  for (let i = 0; i < allListings.length; i++){
    const currentLI = allListings[i];       

    filterStakes(lastUsedSetting[firstIdx][3], currentLI, formatStrNIdx[0]);
    filterSz(lastUsedSetting[firstIdx][4], currentLI, formatStrNIdx[0]);    
  }
}

function holdEmChosenGame(){    
  const formatNIdx = formatCapitalizedNIdx(document.getElementsByClassName("selectedFormat")[0].id);
  loadAndWriteSelectedGame("Hold'em", formatNIdx); 
  colorAndFilterGameClick(formatNIdx);
}
function omahaChosenGame(){  
  const formatNIdx = formatCapitalizedNIdx(document.getElementsByClassName("selectedFormat")[0].id);
  loadAndWriteSelectedGame("Omaha", formatNIdx);  
  colorAndFilterGameClick(formatNIdx);
}
function studChosenGame(){
  const formatNIdx = formatCapitalizedNIdx(document.getElementsByClassName("selectedFormat")[0].id);
  loadAndWriteSelectedGame("Stud", formatNIdx);
  colorAndFilterGameClick(formatNIdx);
}

function loadAndWriteSelectedLimitType(loadAndWriteArguments){
  const limitType = loadAndWriteArguments[0];
  const gameStr = loadAndWriteArguments[1];
  const formatStrNIdx = loadAndWriteArguments[2];

  //load up settings for format, game, and limit/type  
  const gameRegex = gameRegexStr(gameStr);
  const regPatternLoad = "\\[\"" + formatStrNIdx[0] + "\"(, |,)\"" + gameRegex + "\"(, |,)\"" + 
  limitType + "\",[A-Za-z0-9-,()/\"\' ]*\\]"; 
  const regObjLoad = new RegExp(regPatternLoad);  
  lastUsedSetting[formatStrNIdx[1]] = JSON.parse(settingsText.match(regObjLoad)[0]); //loads to lastUsedSetting

  //then change very first line by writing to file
  const newFirstLineSettings  = settingsText.replace(/\[\[\".*\]\]/, JSON.stringify(lastUsedSetting));
  fs.writeFileSync('./Button Settings.txt', newFirstLineSettings, 'utf8', ()=>{});

  //also change first line of set of same game and format   
  settingsText = fs.readFileSync('./Button Settings.txt', 'utf-8');
  const firstSetPatternLoad = "(?<=(\n|\r))\\[\"" + formatStrNIdx[0] + "\"(, |,)\"" + gameRegex + "\",[A-Za-z0-9-,()/\"\' ]*\\]"; //has to be format and game to load up
  const firstSetObjLoad = new RegExp(firstSetPatternLoad);  
  const newFirstLineSetSettings  = settingsText.replace(firstSetObjLoad, JSON.stringify(lastUsedSetting[formatStrNIdx[1]]));  
  fs.writeFileSync('./Button Settings.txt', newFirstLineSetSettings, 'utf8', ()=>{});

  settingsText = fs.readFileSync('./Button Settings.txt', 'utf-8'); //loads up new text
}
function limitTypeWriteLoadVariables(rowNum){//do it according to row
  const formatNIdx = formatCapitalizedNIdx(document.getElementsByClassName("selectedFormat")[0].id);
  const gameStr = document.querySelector('#game #selected td').textContent;
  const gameIdx = convertGameToTblIdx(gameStr);
  const limitTypeStr = document.querySelectorAll('.limitsTypes')[rowNum].getElementsByTagName('p')[gameIdx].textContent;

  return [limitTypeStr, gameStr, formatNIdx] ;
}
function colorAndFilterLimitTypeClick(formatStrNIdx){
  const firstIdx = formatStrNIdx[1];
   
  changeLimitTypeBtnsColor(convertLimitTypeToTblIdx(lastUsedSetting[firstIdx][2]));  
  changeStakesBtnsColor(convertStakesToTblIdx(lastUsedSetting[firstIdx][3]));
  changeSzButtonsColor(convertSizeToTblIdx(lastUsedSetting[firstIdx][4]));
  
  //shows correct listing and set others to none
  const listingDivNIdx = convertGameLimitTypeToListing(lastUsedSetting[firstIdx][1], lastUsedSetting[firstIdx][2], formatStrNIdx[0]);
  showHideListings([firstIdx, listingDivNIdx[0]]); 
  
  //filters listings according to size and stakes now
  const allListings = document.getElementsByClassName(listingDivNIdx[1])[0].getElementsByTagName("li");
  for (let i = 0; i < allListings.length; i++){
    const currentLI = allListings[i];       

    filterStakes(lastUsedSetting[firstIdx][3], currentLI, formatStrNIdx[0]);
    filterSz(lastUsedSetting[firstIdx][4], currentLI, formatStrNIdx[0]);    
  }
}

function firstRowChosenLimit(){
  const loadWriteLimitTypeVar = limitTypeWriteLoadVariables(0);
  loadAndWriteSelectedLimitType(loadWriteLimitTypeVar);
  colorAndFilterLimitTypeClick(loadWriteLimitTypeVar[2]);  
}
function secondRowChosenLimit(){  
  const loadWriteLimitTypeVar = limitTypeWriteLoadVariables(1);
  loadAndWriteSelectedLimitType(loadWriteLimitTypeVar);
  colorAndFilterLimitTypeClick(loadWriteLimitTypeVar[2]);  
}
function thirdRowChosenLimit(){
  if (document.getElementById("emptyOmaha").style.display != "flex"){    
    const loadWriteLimitTypeVar = limitTypeWriteLoadVariables(2);
    loadAndWriteSelectedLimitType(loadWriteLimitTypeVar);
    colorAndFilterLimitTypeClick(loadWriteLimitTypeVar[2]); 
  }  
}

function chosenStakesVariables(numRow){
  const formatNIdx = formatCapitalizedNIdx(document.getElementsByClassName("selectedFormat")[0].id);
  const gameStr = document.querySelector('#game #selected td').textContent;
  const gameIdx = convertGameToTblIdx(gameStr);
  const limitTypeStr = document.querySelector('#limitOrType #selected').getElementsByTagName('p')[gameIdx].textContent
  
  const stakesStr = document.querySelectorAll("#stakes tr")[numRow].getElementsByTagName('td')[0].textContent;
  return [stakesStr, limitTypeStr, gameStr, formatNIdx];
}
function loadAndWriteSelectedStakes(loadAndWriteArguments){
  const stakesStr = loadAndWriteArguments[0];
  const limitType = loadAndWriteArguments[1];
  const gameStr = loadAndWriteArguments[2];
  const formatStrNIdx = loadAndWriteArguments[3];

  //load up settings for format, game, limit/type, and stakes listing
  const gameRegex = gameRegexStr(gameStr);
  const regPatternLoad = "\\[\"" + formatStrNIdx[0] + "\"(, |,)\"" + gameRegex + "\"(, |,)\"" + 
  limitType + "\"(, |,)\"" + stakesStr + "\"[A-Za-z0-9-,()/\"\' ]*\\]"; 
  const regObjLoad = new RegExp(regPatternLoad);  
  lastUsedSetting[formatStrNIdx[1]] = JSON.parse(settingsText.match(regObjLoad)[0]); //loads to lastUsedSetting

  //then change very first line by writing to file
  const newFirstLineSettings  = settingsText.replace(/\[\[\".*\]\]/, JSON.stringify(lastUsedSetting));
  fs.writeFileSync('./Button Settings.txt', newFirstLineSettings, 'utf8', ()=>{});

  //then change first line of set of same game and format   
  settingsText = fs.readFileSync('./Button Settings.txt', 'utf-8');
  const firstSetPatternLoad = "(?<=(\n|\r))\\[\"" + formatStrNIdx[0] + "\"(, |,)\"" + gameRegex + "\",[A-Za-z0-9-,()/\"\' ]*\\]"; //has to be format and game to load up
  const firstSetObjLoad = new RegExp(firstSetPatternLoad );  
  const newFirstLineSetSettings  = settingsText.replace(firstSetObjLoad, JSON.stringify(lastUsedSetting[formatStrNIdx[1]]));  
  fs.writeFileSync('./Button Settings.txt', newFirstLineSetSettings, 'utf8', ()=>{});

  //then change first line of format, game, and limit/type set
  settingsText = fs.readFileSync('./Button Settings.txt', 'utf-8');
  //use (?<=\"\\](\n|\r){2}) instead of (?<!\\[|, ) 
  const firstSubsetPatternLoad = "(?<=\"\\](\n|\r){2})\\[\"" + formatStrNIdx[0] + "\"(, |,)\"" + gameRegex + "\"(, |,)\"" + 
  limitType + "\"[A-Za-z0-9-,()/\"\' ]*\\]"; //has to be format and game to load up
  const firstSubsetObjLoad = new RegExp(firstSubsetPatternLoad);  
  const newFirstLineSubsetSettings  = settingsText.replace(firstSubsetObjLoad, JSON.stringify(lastUsedSetting[formatStrNIdx[1]]));  
  fs.writeFileSync('./Button Settings.txt', newFirstLineSubsetSettings, 'utf8', ()=>{});

  settingsText = fs.readFileSync('./Button Settings.txt', 'utf-8'); //loads up new text
}
function colorAndFilterStakesClick(formatStrNIdx){
  const firstIdx = formatStrNIdx[1];
  changeStakesBtnsColor(convertStakesToTblIdx(lastUsedSetting[firstIdx][3]));
  changeSzButtonsColor(convertSizeToTblIdx(lastUsedSetting[firstIdx][4]));
  
  //shows correct listing and set others to none
  const listingDivNIdx = convertGameLimitTypeToListing(lastUsedSetting[firstIdx][1], lastUsedSetting[firstIdx][2], formatStrNIdx[0]);
  showHideListings([firstIdx, listingDivNIdx[0]]); 
  
  //filters listings according to size and stakes now
  const allListings = document.getElementsByClassName(listingDivNIdx[1])[0].getElementsByTagName("li");
  for (let i = 0; i < allListings.length; i++){
    const currentLI = allListings[i];       

    filterStakes(lastUsedSetting[firstIdx][3], currentLI, formatStrNIdx[0]);
    filterSz(lastUsedSetting[firstIdx][4], currentLI, formatStrNIdx[0]);    
  }
}

function allStakesChosen(){  
  const belowFunctionArguments = chosenStakesVariables(1);
  loadAndWriteSelectedStakes(belowFunctionArguments);
  colorAndFilterStakesClick(belowFunctionArguments[3]);
}
function highStakesChosen(){  
  const belowFunctionArguments = chosenStakesVariables(2);
  loadAndWriteSelectedStakes(belowFunctionArguments);  
  colorAndFilterStakesClick(belowFunctionArguments[3]);
}
function mediumStakesChosen(){  
  const belowFunctionArguments = chosenStakesVariables(3);
  loadAndWriteSelectedStakes(belowFunctionArguments);  
  colorAndFilterStakesClick(belowFunctionArguments[3]);
}
function lowStakesChosen(){  
  const belowFunctionArguments = chosenStakesVariables(4);
  loadAndWriteSelectedStakes(belowFunctionArguments);  
  colorAndFilterStakesClick(belowFunctionArguments[3]);
}
function microStakesChosen(){  
  const belowFunctionArguments = chosenStakesVariables(5);
  loadAndWriteSelectedStakes(belowFunctionArguments);  
  colorAndFilterStakesClick(belowFunctionArguments[3]);
}


function sizeRegexStr(sizeString){
  if (sizeString == "2-Max (Heads Up)"){
    return "2-Max \\(Heads Up\\)";
  }
  else{
    return sizeString;
  }
}
function chosenSizeVariables(numRow){
  const formatNIdx = formatCapitalizedNIdx(document.getElementsByClassName("selectedFormat")[0].id);
  const gameStr = document.querySelector('#game #selected td').textContent;
  const gameIdx = convertGameToTblIdx(gameStr);
  const limitTypeStr = document.querySelector('#limitOrType #selected').getElementsByTagName('p')[gameIdx].textContent
  const stakesStr = document.querySelector("#stakes #selected td").textContent;
  const sizeStr = document.querySelectorAll("#size tr")[numRow].getElementsByTagName('td')[0].textContent;
  return [sizeStr, stakesStr, limitTypeStr, gameStr, formatNIdx];
}
function loadAndWriteSelectedSize(loadAndWriteArguments){
  const sizeStr = loadAndWriteArguments[0];
  const stakesStr = loadAndWriteArguments[1];
  const limitType = loadAndWriteArguments[2];
  const gameStr = loadAndWriteArguments[3];
  const formatStrNIdx = loadAndWriteArguments[4];
  
  //change lastSettings variable
  lastUsedSetting[formatStrNIdx[1]] = [formatStrNIdx[0], gameStr, limitType, stakesStr, sizeStr];

  //then change very first line by writing to file
  const newFirstLineSettings  = settingsText.replace(/\[\[\".*\]\]/, JSON.stringify(lastUsedSetting));
  fs.writeFileSync('./Button Settings.txt', newFirstLineSettings, 'utf8', ()=>{});

  //then change first line of set of same game and format
  const gameRegex = gameRegexStr(gameStr);   
  settingsText = fs.readFileSync('./Button Settings.txt', 'utf-8');
  const firstSetPatternLoad = "(?<=(\n|\r))\\[\"" + formatStrNIdx[0] + "\"(, |,)\"" + gameRegex + "\",[A-Za-z0-9-,()/\"\' ]*\\]"; //has to be format and game to load up
  const firstSetObjLoad = new RegExp(firstSetPatternLoad);  
  const newFirstLineSetSettings  = settingsText.replace(firstSetObjLoad, JSON.stringify(lastUsedSetting[formatStrNIdx[1]]));  
  fs.writeFileSync('./Button Settings.txt', newFirstLineSetSettings, 'utf8', ()=>{});

  //then change first line of format, game, and limit/type subset
  settingsText = fs.readFileSync('./Button Settings.txt', 'utf-8');
  //use (?<=\"\\](\n|\r){2}) instead of (?<!\\[|, ) 
  const firstSubsetPatternLoad = "(?<=\"\\](\n|\r){2})\\[\"" + formatStrNIdx[0] + "\"(, |,)\"" + gameRegex + "\"(, |,)\"" + 
  limitType + "\"[A-Za-z0-9-,()/\"\' ]*\\]"; //has to be format and game to load up
  const firstSubsetObjLoad = new RegExp(firstSubsetPatternLoad);  
  const newFirstLineSubsetSettings  = settingsText.replace(firstSubsetObjLoad, JSON.stringify(lastUsedSetting[formatStrNIdx[1]]));  
  fs.writeFileSync('./Button Settings.txt', newFirstLineSubsetSettings, 'utf8', ()=>{});
  settingsText = fs.readFileSync('./Button Settings.txt', 'utf-8');

  //finally change normal line of subset
  const sizeRegex = sizeRegexStr(sizeStr);  
  const lookbehindNormalLine = "(?<=\\](\n|\r){2}\\[\"" + formatStrNIdx[0] + "\"(, |,)\"" + gameRegex + "\"(, |,)\"" + 
  limitType + "\"(, |,)\"" + stakesStr + "\"(, |,)\"" + sizeRegex + "\"\\][^]+)";
  const normalPatternLoad = lookbehindNormalLine + "\\[\"" + formatStrNIdx[0] + 
  "\"(, |,)\"" + gameRegex + "\"(, |,)\"" + limitType + "\"(, |,)\"" + stakesStr + ".*"; 
  const normalObjLoad = new RegExp(normalPatternLoad);  
  const newNormalLineSettings  = settingsText.replace(normalObjLoad, JSON.stringify(lastUsedSetting[formatStrNIdx[1]]));  
  fs.writeFileSync('./Button Settings.txt', newNormalLineSettings, 'utf8', ()=>{});
  settingsText = fs.readFileSync('./Button Settings.txt', 'utf-8'); //loads up new text
}
function colorAndFilterSizeClick(formatStrNIdx){
  const firstIdx = formatStrNIdx[1];
  changeSzButtonsColor(convertSizeToTblIdx(lastUsedSetting[firstIdx][4]));
  
  //shows correct listing and set others to none
  const listingDivNIdx = convertGameLimitTypeToListing(lastUsedSetting[firstIdx][1], lastUsedSetting[firstIdx][2], formatStrNIdx[0]);
  showHideListings([firstIdx, listingDivNIdx[0]]); 
  
  //filters listings according to size and stakes now
  const allListings = document.getElementsByClassName(listingDivNIdx[1])[0].getElementsByTagName("li");
  for (let i = 0; i < allListings.length; i++){
    const currentLI = allListings[i];       

    filterStakes(lastUsedSetting[firstIdx][3], currentLI, formatStrNIdx[0]);
    filterSz(lastUsedSetting[firstIdx][4], currentLI, formatStrNIdx[0]);    
  }
}

function allSizesChosen(){
  const belowFunctionArguments = chosenSizeVariables(1);
  loadAndWriteSelectedSize(belowFunctionArguments);
  colorAndFilterSizeClick(belowFunctionArguments[4]);
}
function twoMaxChosen(){
  const belowFunctionArguments = chosenSizeVariables(2);
  loadAndWriteSelectedSize(belowFunctionArguments);
  colorAndFilterSizeClick(belowFunctionArguments[4]);
}
function sixMaxChosen(){
  const belowFunctionArguments = chosenSizeVariables(3);
  loadAndWriteSelectedSize(belowFunctionArguments);
  colorAndFilterSizeClick(belowFunctionArguments[4]);
}
function eightMaxChosen(){
  const belowFunctionArguments = chosenSizeVariables(4);
  loadAndWriteSelectedSize(belowFunctionArguments);
  colorAndFilterSizeClick(belowFunctionArguments[4]);
}
function nineMaxChosen(){
  const belowFunctionArguments = chosenSizeVariables(5);
  loadAndWriteSelectedSize(belowFunctionArguments);
  colorAndFilterSizeClick(belowFunctionArguments[4]);  
}


//lobby: organize listings is a function!!!!!! based on listingsOrganizer buttons
//search text box to filter by name
//take a seat, observe table buttons on preview div
//cashier, deposit, withdraw buttons




function addNodesToListing(listingVar, listingFormat, newGameInfo){
  //listing format : cash, tournament, sng
  if (listingFormat == 'cash'){
    //Name
    //Game
    //Stakes
    //Players           
    //Wait            
    //Avg Pot   
    //Plrs/Flop        
    //H/hr

    //[nameOfTable, gameType, limitType, stakesType, numOfPlayers]

    const tableName = document.createTextNode(newGameInfo[0]);
    listingVar.appendChild(tableName);

    const gameType = newGameInfo[1];
    const limitType = newGameInfo[2];    
    gameLimitNode(limitType, gameType, listingVar);

    const gameStakes = document.createTextNode(newGameInfo[3]);
    listingVar.appendChild(gameStakes);

    const numPlayers = document.createTextNode("0/" + newGameInfo[4]); 
    listingVar.appendChild(numPlayers);

    listingVar.appendChild(document.createTextNode());//Wait
    listingVar.appendChild(document.createTextNode());//Avg Pot
    listingVar.appendChild(document.createTextNode());//Plrs/Flop
    listingVar.appendChild(document.createTextNode());//H/hr
  }
  else if (listingFormat == 'tournament'){
    //Date 0 
    //Name 1
    //Size 2
    //Game 3 
    //Buy&#8209In 4  
    //Speed     5
    //State 6
    //Enrolled 7

    const tournamentDate = document.createTextNode(newGameInfo[0]);
    listingVar.appendChild(tournamentDate);

    tournamentSnGNodes(newGameInfo, listingVar);    
    listingVar.appendChild(document.createTextNode());//tournamentEnrolled
  }
  else{//sng 
    //Name
    //Game
    //Buy&#8209In  
    //Speed     
    //State
    //Enrolled
    tournamentSnGNodes(newGameInfo, listingVar);    
    listingVar.appendChild("0/" + newGameInfo[5]);//tournamentEnrolled
  }
}
function gameLimitNode(limitType, gameType, listingVar){  
  let gameLimitType;
  if(limitType == "No Limit"){
    gameLimitType = document.createTextNode("NL " + gameType);
  }
  else if (limitType == "Pot Limit"){
    gameLimitType = document.createTextNode("PL " + gameType);
  }
  else{
    gameLimitType = document.createTextNode("FL " + gameType);
  }
  listingVar.appendChild(gameLimitType);
}
function tournamentSnGNodes(newGameInfo, listingVar){
  let decrement;
  if (newGameInfo[0] == 'tournament'){
    decrement = 0;
  }
  else{//sng
    decrement = -1;
  }

  const tournamentSnGName = document.createTextNode(newGameInfo[1 + decrement]);
  listingVar.appendChild(tournamentSnGName);

  if (newGameInfo[0] == 'tournament'){//tournamentSize textNode
    const tournamentSize = document.createTextNode(newGameInfo[2]);
    listingVar.appendChild(tournamentSize);
    decrement = 1;
  }

    //Date 0 
    //Name 1
    //Size 2
    //Game 3 
    //Buy&#8209In 4  
    //Speed     5
    //State 6
    //Enrolled 7

    //Name
    //Game
    //Buy&#8209In  
    //Speed     
    //State
    //Enrolled

  //[Date, nameOfTournament, size, gameType, limitType, buy-in, speed, state, enrolled]
  //[nameOfSnG, gameType, limitType, buy-in, speed, state, enrolled]

  //game and limit have their own selector menus
  const gameType = newGameInfo[2 + decrement];
  const limitType = newGameInfo[3 + decrement];    
  gameLimitNode(limitType, gameType, listingVar);

  const tournamentSnGBuyIn = document.createTextNode(newGameInfo[4 + decrement]);
  listingVar.appendChild(tournamentSnGBuyIn);

  const tournamentSnGSpeed = document.createTextNode(newGameInfo[5 + decrement]);
  listingVar.appendChild(tournamentSnGSpeed);
  
  listingVar.appendChild(document.createTextNode());//tournamentState
}
function addListingToDiv(listingvar, listingFormat, gameType, limitType){

  if (gameType == "Hold'Em"){
    if(limitType == "No Limit"){
      document.getElementById('nlhe' + listingFormat).appendChild(listingvar);
    }
    else if (limitType == "Pot Limit"){
      document.getElementById('plhe' + listingFormat).appendChild(listingvar);
    }
    else{
      document.getElementById('flhe' + listingFormat).appendChild(listingvar);
    }
  }
  else if (gameType == "Omaha"){
    document.getElementById('omaha' + listingFormat).appendChild(listingvar);
  }
  else if (gameType == "Omaha Hi/Lo"){
    document.getElementById('omahaHiLo' + listingFormat).appendChild(listingvar);
  }
  else if (gameType == "7 Card Stud"){
    document.getElementById('stud' + listingFormat).appendChild(listingvar);
  }
  else if (gameType == "7 Card Stud Hi/Lo"){
    document.getElementById('studHiLo' + listingFormat).appendChild(listingvar);
  }
  else{//Razz
    document.getElementById('razz' + listingFormat).appendChild(listingvar);
  }  
}




//ipcRenderer.send('open: Cashier Window', );//change to 'open: Cashier Window' when you click cashier button

