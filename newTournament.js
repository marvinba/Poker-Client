const electron = require('electron');
const {ipcRenderer} = electron;

let nameApprovedInfo;

document.getElementById('createNewCash').addEventListener('click', createNewCashGame);
document.getElementById("cancelButton").addEventListener('click', ()=>{
    window.close();
})

//on input for table Name only letters and whitespace allowed, no numbers or anything else  
    //  replace(/[A-Za-z0-9]*\s*/g, '') ==  '' if true means meets criteria

//find out minimum players to play games

function getCorrectLimit(){
    const gameTypeGetID = document.getElementById('game-select');
    const gameType = gameTypeGetID.options[gameTypeGetID.selectedIndex].text;

    if ((gameType == "Hold'Em") || (gameType == "Omaha") || (gameType == "Omaha Hi/Lo")){
        document.getElementById("regular-limit-select").style.display = "flex";
        document.getElementById("stud-limit-select").style.display = "none";
    }
    else{
        document.getElementById("stud-limit-select").style.display = "flex";
        document.getElementById("regular-limit-select").style.display = "none";
    }    
}

getCorrectLimit();

//seperate elements with margin-bottom

document.getElementById('game-select').addEventListener ("input", getCorrectLimit);//changes on select input

function createNewCashGame(){
    
    let nameOfTable = document.getElementById('nameOfTable').value;
   
    //send name into main to check for repeats and if 4 already then have to choose another name
    const gameTypeGetID = document.getElementById('game-select');
    const gameType = gameTypeGetID.options[gameTypeGetID.selectedIndex].text;

    let limitType;
    if ((gameType == "7 Card Stud") || (gameType == "7 Card Stud Hi/Lo") || (gameType == "Razz")){
        const limitGetID = document.getElementById('stud-limit-select');
        limitType = limitGetID.options[limitGetID.selectedIndex].text;
    }
    else{
        const limitGetID = document.getElementById('regular-limit-select');
        limitType = limitGetID.options[limitGetID.selectedIndex].text;
    }

    const stakesTypeGetID = document.getElementById('stakes-select');
    const stakesType = stakesTypeGetID.options[stakesTypeGetID.selectedIndex].text;

    //see max players for stud
    const numOfPlayersGetID = document.getElementById('numPlayer-select');
    const numOfPlayers = numOfPlayersGetID.options[numOfPlayersGetID.selectedIndex].text;

    nameOfTable = nameOfTable.replace(/\s+/g, ' ');//replaces all whitespace characters with ' '
    nameOfTable = nameOfTable.trim(); //gets rid of extra whitespace if it begins or ends string
    
    if(nameOfTable.match(/[IiVvXxLlCcDdMm ]+$/)){//match means ends with cons. roman numerals
        document.getElementById("nameError").textContent = "Naming Error. Consecutive Roman Numerals aren't allowed."
    }
    else{
        document.getElementById('nameOfTable').value = '';
        ipcRenderer.send('create new Cash', [nameOfTable, gameType, limitType, stakesType, numOfPlayers]);
    }    
}

//check for names, only do 4 max of same name

document.getElementById('yesBtn').addEventListener('click', createNewNameCash);
document.getElementById('noBtn').addEventListener('click', clearUpInfo);

function createNewNameCash(){ 
    ipcRenderer.send('create new Cash', nameApprovedInfo, true);//closes createCashGame in main
    document.getElementById('myModal').style.display = "none";    
};

function clearUpInfo(){
    nameApprovedInfo = undefined;
    document.getElementById('myModal').style.display = "none";   
    document.getElementsByClassName("belowModal")[0].removeAttribute('id');
}

//style modal window and make everything else black
ipcRenderer.on('new Table Name', (e,oldNNewInfo)=>{
    let previousModalText = document.getElementById('modalText').textContent;
    const originalNamePattern = "\\(insert original name\\)";
    const originalNameRegex = new RegExp(originalNamePattern);
    document.getElementById('modalText').textContent = previousModalText.replace(originalNameRegex, oldNNewInfo[1][0]);

    previousModalText = document.getElementById('modalText').textContent;
    const newNamePattern = "\\(insert new name\\)";
    const newNameRegex = new RegExp(newNamePattern);
    document.getElementById('modalText').textContent = previousModalText.replace(newNameRegex, oldNNewInfo[0]);

    document.querySelector("body:not(.modal-content)").style.filter = "blur"
    backgroundColor = "rgba(0,0,0,0.4)";
    document.getElementById('myModal').style.display = "flex";   
    document.getElementsByClassName("belowModal")[0].setAttribute('id', 'modalVisible');

    //in case newName approved  
    nameApprovedInfo = oldNNewInfo[1].slice();
    nameApprovedInfo.splice(0, 1, oldNNewInfo[0]);
})

//modalVisible

ipcRenderer.on('Table Name Failure', ()=>{
    //Table Name is already used. Choose another name.

    //'Table Name Failure', [newGameInfo]) 4 repeats
    //maybe get rid of newGameInfo???
});

