const electron = require('electron');
const {ipcRenderer} = electron;
const io = require("socket.io-client");
const socket = io('http://localhost:3000')

let nameApprovedInfo;
let changeFirstBoolean;


document.getElementById('createNewCash').addEventListener('click', createNewCashGame);
document.getElementById("cancelButton").addEventListener('click', ()=>{
    window.close();
})


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


document.getElementById('game-select').addEventListener ("input", getCorrectLimit);//changes on select input

function createNewCashGame(){    
    let nameOfTable = document.getElementById('nameOfTable').value;
    nameOfTable = nameOfTable.trim();

    if ((nameOfTable == '')){//empty string
        document.getElementById("nameError").textContent = "Naming Error. Empty String."
    }
    else{
        const lettersMatch = nameOfTable.match(/[A-Za-z ]+/g);
        if(lettersMatch == nameOfTable){//then name only consists of letters and spaces    

            if(nameOfTable.length <= 13){
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

                if(nameOfTable.match(/(?<![A-Za-z]+)[IiVvXxLlCcDdMm ]+$/)){//match means ends with cons. roman numerals
                    document.getElementById("nameError").textContent = "Naming Error. Consecutive Roman Numerals aren't allowed."
                }
                else{
                    document.getElementById('nameOfTable').value = '';
                    socket.emit('create new Cash', [nameOfTable, gameType, limitType, stakesType, numOfPlayers]);
                }    
            }  
            else{//exceeds 13 character limit
                document.getElementById("nameError").textContent = "Naming Error. Name exceeds 13 character limit."
            }
        }
        else{//not letters or spaces
            document.getElementById("nameError").textContent = "Naming Error. Name doesn't only include letter and spaces."
        }
    }
}

//check for names, only do 4 max of same name

//modal buttons
document.getElementById('yesBtn').addEventListener('click', createNewNameCash);
document.getElementById('noBtn').addEventListener('click', clearUpInfo);

function createNewNameCash(){//what if first name
    socket.emit('create new Cash', nameApprovedInfo, changeFirstBoolean, true);//closes createCashGame in main
    document.getElementById('myModal').style.display = "none";    
    document.body.removeAttribute("class");
    document.getElementsByClassName("aboveModal")[0].classList.remove("blurBackground");
    document.getElementsByClassName("belowModal")[0].classList.remove("blurBackground");

    //buttons no longer disabled
    document.getElementById('createNewCash').style.pointerEvents = 'auto';
    document.getElementById("cancelButton").style.pointerEvents = 'auto';
};

function clearUpInfo(){
    nameApprovedInfo = undefined;
    document.getElementById('myModal').style.display = "none";   
    document.getElementsByClassName("belowModal")[0].removeAttribute('id');
    document.body.removeAttribute("class");
    document.getElementsByClassName("aboveModal")[0].classList.remove("blurBackground");
    document.getElementsByClassName("belowModal")[0].classList.remove("blurBackground");

    //buttons no longer disabled
    document.getElementById('createNewCash').style.pointerEvents = 'auto';
    document.getElementById("cancelButton").style.pointerEvents = 'auto';
}

//style modal window and make everything else black
ipcRenderer.on('new Table Name', (e, oldNNewInfo, changeFirstBool = false)=>{
    let previousModalText = document.getElementById('modalText').textContent;
    const originalNamePattern = "\\(insert original name\\)";
    const originalNameRegex = new RegExp(originalNamePattern);
    document.getElementById('modalText').textContent = previousModalText.replace(originalNameRegex, oldNNewInfo[1][0]);

    previousModalText = document.getElementById('modalText').textContent;
    const newNamePattern = "\\(insert new name\\)";
    const newNameRegex = new RegExp(newNamePattern);
    document.getElementById('modalText').textContent = previousModalText.replace(newNameRegex, oldNNewInfo[0]);

    document.body.setAttribute("class", "changeBodyColor");
    document.getElementsByClassName("aboveModal")[0].classList.add("blurBackground");
    document.getElementsByClassName("belowModal")[0].classList.add("blurBackground");

    //disable buttons outside Modal click functions 
    document.getElementById('createNewCash').style.pointerEvents = 'none';
    document.getElementById("cancelButton").style.pointerEvents = 'none';

    document.getElementById('myModal').style.display = "flex";   
    document.getElementsByClassName("belowModal")[0].setAttribute('id', 'modalVisible');

    //in case newName approved  
    nameApprovedInfo = oldNNewInfo[1].slice();
    nameApprovedInfo.splice(0, 1, oldNNewInfo[0]);
    changeFirstBoolean = changeFirstBool;
})


ipcRenderer.on('Table Name Failure', ()=>{
    //Table Name is already used. Choose another name.

    //'Table Name Failure', [newGameInfo]) 4 repeats
    //maybe get rid of newGameInfo???
});

socket.on('Add Cash Game listing via Socket', (cashGameInfo) => {
    //be used to send back to main to add listing
    ipcRenderer.send('Add Cash Game listing sent from newCashGame', cashGameInfo);
});

socket.on('Create cashGameWindow for sender via Socket', (cashGameInfo) =>{
    ipcRenderer.send('create cashGameWindow for sender via main', cashGameInfo);
})
