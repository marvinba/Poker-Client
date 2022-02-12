const {Deck} = require('./Deck.js');
const {Player} = require('./Player.js');
const {Game} = require('./Game.js');
const {winningHand, compareHands, getHandType, convertTypeValToStr} = require('./Functions.js');
const {Card} = require('./Card.js');
const Pot = require('./Pot.js');
const betAllInAmt = require('./betAllInAmt.js');
const fs = require('fs');
const {idxOfCoordinates, bestHandsOutput, bestActionOutput, displayArrChips, betTextOutput, displayPotChips, moveButton} = require('./Coordinates and Chips.js');

const twoto10MaxBlue =  [
    //2-max
    [["345px", "-5px"], ["345px", "365px"]], 
    //6-max
    [["69.53282px", "67.79083px"], ["69.53282px", "292.20917px"], ["345px", "-25px"], ["620.46718px", "37.79083px"], ["620.46718px", "262.20917px"], ["345px", "325px"]], 
    //8-max
    [["237.16222px", "365.75677px"], ["41.43155px", "269.56658px"], ["41.43155px", "70.43342px"], ["237.16222px", "-25.75677px"], ["452.83778px","-35.75677px"], ["648.56845px", "40.43342px"], ["648.56845px", "219.56658px"], ["452.83778px", "295.75677px"]], 
    //9-max
    [["345px", "375px"], ["155.62076px", "334.78408px"], ["5.67675px", "211.57110px"], ["69.53282px","37.79083px"], ["249.04192px", "-37.71966px"], ["440.95808px", "-47.71966px"], ["620.46718px", "7.79083px"], ["684.32325px", "161.57110px"], ["534.37924px", "264.78408px"]],
    //10-max
    [["345px", "375px"], ["173.93477px", "340.75971px"], ["26.54553px", "243.82979px"], ["26.54553px", "76.17021px"], ["173.93477px","-20.75971px"], ["345px", "-55px"], ["516.06522px", "-40.75971px"], ["663.45447px", "36.17021px"], ["663.45447px", "183.82979px"],["516.06523px", "260.75971px"]]
];

const twoto10MaxSeats = [
    //2-max
    [["220px", "310px"], ["20px", "-130px"]],
    //6-max
    [["-155.46718px", "207.20917px"], ["-385.46718px", "-27.20917px"], ["-240px", "-130px"], ["-64.53282px", "-27.20917px"], ["-294.53282px", "207.20917px"], ["-900px", "310px"]],
    //8-max
    [["72.16222px","300.75677px"], ["-413.56845px","184.56658px"], ["-643.56845px", "-4.56658px"], ["-617.83778px", "-120.75677px"], ["-522.16222px","-120.75677px"], ["-496.43155px","-4.56658px"], ["-726.43155px", "184.56658px"], ["-1212.16222px", "300.75677px"]],
    //9-max
    [["220px","310px"], ["-299.37924px", "249.78408px"], ["-679.32325px", "106.5711px"], ["-845.46718px","-27.20917px"], ["-845.95808px","-122.71966px"], ["-754.04192px", "-122.71966px"], ["-754.53282px", "-27.20917px"],["-920.67675px","106.5711px"],["-1300.62076px","249.78408px"]],
    //10-max
    [["220px","310px"], ["-251.06523px", "255.75971px"], ["-628.45447px", "138.82979px"], ["-858.45447px", "-18.82979px"], ["-941.06523px", "-105.75971px"], ["-900px", "-130px"], ["-888.93478px", "-105.75971px"], ["-971.54553px", "-18.82979px"], ["-1201.54553px", "138.82979px"], ["-1578.93477px", "255.75971px"]]
];
const bestHandsAllSizes = [
    //2-max
    [["630px", "441.2px"] ,["630px", "160px"]],
    //6-max
    [["354.53282px", "396.2px"], ["354.53282px", "245px"], ["630px", "160px"], ["905.46718px", "245px"], ["905.46718px", "396.2px"], ["630px", "441.2px"]],
    //8-max
    [["482.15625px", "431.956px"], ["326.4375px", "373.556px"], ["326.4375px", "263.231px"], ["482.15625px", "169.244px"], ["777.84375px","169.244px"], ["933.5688px", "263.231px"], ["933.5688px", "373.556px"], ["777.84375px", "431.956px"]],
    //9-max
    [["630px", "441.2px"], ["410.625px", "420.981px"],["290.681px", "376.569px"], ["354.537px", "242.794px"], ["484.044px", "167.281px"], ["775.963px", "167.281px"], ["905.469px", "242.794px"], ["969.325px", "376.569px"], ["849.381px", "420.981px"]],
    //10-max
    [["630px","441.2px"], ["458.938px", "425.756px"], ["351.550px", "378.825px"], ["351.550px", "221.175px"], ["458.938px", "184.244px"], ["630px", "160px"], ["801.069px", "184.244px"], ["908.456px", "221.175px"], ["908.456px", "378.825px"] , ["801.069px", "425.756px"]]
];
const bestActionsAllSizes = [
    //2-max
    [["630px", "423.2px"] ,["630px", "178px"]],
    //6-max
    [["354.53282px", "414.2px"], ["354.53282px", "227px"], ["630px", "178px"], ["905.46718px", "227px"], ["905.46718px", "414.2px"], ["630px", "423.2px"]],
    //8-max
    [["482.15625px", "413.956px"], ["326.4375px", "391.556px"], ["326.4375px", "245.231px"], ["482.15625px", "187.244px"], ["777.84375px","187.244px"], ["933.5688px", "245.231px"], ["933.5688px", "391.556px"], ["777.84375px", "413.956px"]],
    //9-max
    [["630px", "423.2px"], ["410.625px", "402.981px"],["290.681px", "358.569px"], ["354.537px", "224.794px"], ["484.044px", "185.281px"], ["775.963px", "185.281px"], ["905.469px", "224.794px"], ["969.325px", "358.569px"], ["849.381px", "402.981px"]],
    //10-max
    [["630px","423.2px"], ["458.938px", "407.756px"], ["351.550px", "360.825px"], ["351.550px", "239.175px"], ["458.938px", "202.244px"], ["630px", "178px"], ["801.069px", "202.244px"], ["908.456px", "239.175px"], ["908.456px", "360.825px"] , ["801.069px", "407.756px"]]
];
const buttonAngles = [
    //2-max
    [ 4.41, 1.27],
  //   //6-max
  //   [, , , , , ],
  //   //8-max
  //   [, , , , , , , ],
  //   //9-max
  //   [, , , , , , , ,],
  //   //10-max
  //   [, , , , , , , , ,]
];

const chipAmountStrArr = ["250M", "100M", "25M", "5M", "1M", "500K", "100K", "25K", "5K", "1K", "500", "100", "50", "25", "5", "1", "25cent", "5cent", "1cent"];


function convertSuitToNum(suitStr){
    if(suitStr == 's'){
        return 4;                        
    }
    else if(suitStr == 'h'){
        return 3;                        
    }
    else if(suitStr == 'c'){
        return 2;                        
    }
    else{
        return 1;
    }
}
function getHoleCardImg(cardObj){
    const imgToReturn = new Image();
    imgToReturn.src = "Images/Hole Cards/Playing Cards/PNG-cards-1.3/" + cardObj.value.toString() + cardObj.suit + ".png"; //pull img from directory and assign it;
    return imgToReturn;
}

function numPlayersTblSize(sizeInput){
    if ((sizeInput > 2) && (sizeInput <= 6)){
        return 6;
    }
    else if ((sizeInput > 6) && (sizeInput <= 8)){
        return 8;
    }
    else{
        return sizeInput
    }
}
function createGraphBlueDots(sizeInput){

    for (let i = 1; i <= sizeInput; i++){
        //creates blue dots
        const seatDot = document.createElement('div');
        seatDot.setAttribute('id', 'seat'+ i.toString() + 'Dot'); 
        seatDot.setAttribute('class', 'blueDot'); 
        document.getElementById('blueDots').appendChild(seatDot);   
        
        //graphs blue dots
        seatDot.style.position = "relative";
        const idxSetCoordinates = idxOfCoordinates(sizeInput); 
        seatDot.style.left = twoto10MaxBlue[idxSetCoordinates][i-1][0];
        seatDot.style.top = twoto10MaxBlue[idxSetCoordinates][i-1][1]; 
    }    
}
function addHoleCardsToBoard(){

}

class bettingRound{
    constructor(cashGameObj){
        this.afterFirstIteration = false;
    }
    roundLoop(cashGameObj, previousI, prevSeatNum){
        if ((prevSeatNum == cashGameObj.lastToAct) && (this.afterFirstIteration)){//breaks loop because round is over
            if((cashGameObj.playersInPot.length == 1) && (cashGameObj.allInCounter >= 1)){
                displayPotChips(cashGameObj);
                cashGameObj.clearPreviousBets();
				cashGameObj.clearPreviousActions(true);
                cashGameObj.noMoreBetting(); 
            }
            else{
                cashGameObj.roundOver = true;
                cashGameObj.betAmounts = [0];
                cashGameObj.clearPreviousBets();
                cashGameObj.clearPreviousActions();
                displayPotChips(cashGameObj);
                cashGameObj.allRounds();
            }
        }
        else{
            let nextIdx = previousI + 1;
            if(nextIdx == cashGameObj.playersInPot.length){//last idx in playersInPot
                nextIdx = 0;
            }               
            const playerIdx = cashGameObj.playersInPot[nextIdx]; 
            cashGameObj.table[playerIdx].action(cashGameObj, this, nextIdx);   
        }
    }
}
//make sure previousBets are all set to 0 after round is over
class CashGame {
    constructor(numPlayers, stakes){
        //later on gameType argument in constructor will specify how many hole cards (e.g. holdem, omaha, etc)			
		this.table = new Array(numPlayers);
        this.size = numPlayers;  
        this.actualTblSz = numPlayersTblSize(this.size);     
        
        this.blinds = [parseFloat(stakes.match(/\d+\.*\d*(?=\/)/)), 
            parseFloat(stakes.match(/(?<=\/\$)\d+\.*\d*/))];

        this.addToOutermostPot = this.addToOutermostPot.bind(this);
        this.calculatePots   = this.calculatePots.bind(this); 
        this.btnChosen = false; 
        this.orderedBool = false;
        this.btnAnimation = false;

        this.createSeatDivs();      
        this.startGame();  
    }  
    createSeatDivs(){
        
        const divSeats = document.getElementsByClassName('cashGameSeats')[0];            
        //createGraphBlueDots(this.actualTblSz);

        for (let i = 1; i <= this.size; i++){      
            const actionDiv = document.createElement('div');
            actionDiv.setAttribute('id', 'action'+ i.toString() + 'Div'); 
            actionDiv.setAttribute('class', 'actionDivs'); //necessary? might delete later      
            
            const actionDivText = document.createElement('p');
            actionDivText.setAttribute('id', 'action'+ i.toString() + 'Text'); 
            actionDivText.setAttribute('class', 'actionDivsText');     
            actionDiv.appendChild(actionDivText);

            const divSeat = document.createElement('div');
            divSeat.setAttribute('id', 'seat'+ i.toString() + 'Div'); 
            divSeat.setAttribute('class', 'seatDivs'); //necessary? might delete later

            //holeCardsDiv created, class set later for LtoR or RtoL
            const divHoleCards = document.createElement('div'); 
            divHoleCards.setAttribute('id', 'holeCards'+ i.toString() + 'div');                          
                         
            //holeCards created and appended to holeCardsDiv
            const buttonCard = document.createElement('div');
            buttonCard.setAttribute('class', 'regCardDiv');
            buttonCard.classList.add('buttonCardDiv');
            buttonCard.setAttribute('id', 'buttonCard' + i.toString() + 'Div');
            const holeCard1 = document.createElement('div');
            holeCard1.setAttribute('class', 'regCardDiv');
            holeCard1.classList.add('holeCards');
            const holeCard2 = document.createElement('div');
            holeCard2.setAttribute('class', 'regCardDiv');
            holeCard2.classList.add('holeCards');
            divHoleCards.appendChild(buttonCard);
            divHoleCards.appendChild(holeCard1);
            divHoleCards.appendChild(holeCard2);

            const containerDiv = document.createElement('div');
            containerDiv.setAttribute('class', 'seatContainers'); 

            //circle, semicircle, and rectangle created
            const divCircle = document.createElement('div');
            divCircle.setAttribute('class', 'divCircles');
            const divNonCircle = document.createElement('div');
            const divSemiCircle = document.createElement('div');
            const divRectangle = document.createElement('div');
            divRectangle.setAttribute('class', 'divRectangles'); 
            
            //usernameText, actionText, and userChipsText created and appended to divRectange
            const usernameText = document.createElement('p');
            usernameText.setAttribute('id', 'playerUsername'+ i.toString() + 'p'); 
            usernameText.setAttribute('class', 'playerUsernamePs');             
            const actionText = document.createElement('p');
            actionText.setAttribute('id', 'playerAction'+ i.toString() + 'p'); 
            actionText.setAttribute('class', 'playerActionPs'); 
            const userChipsText = document.createElement('p');
            userChipsText.setAttribute('id', 'chipStack'+ i.toString() + 'p'); 
            userChipsText.setAttribute('class', 'chipStackPs'); 
            divRectangle.appendChild(usernameText);
            divRectangle.appendChild(actionText);
            divRectangle.appendChild(userChipsText);          
            
            //moves holeCardDiv differently when its rightToLeft or leftToRight 
            //sets class to rToLSeats or lToRSeats and sets class then appends semicircle to containerDiv
            if (i <= Math.ceil(this.actualTblSz/2)){//right to left playerDivs
                divHoleCards.setAttribute('class', 'holeCardsDivRtoL'); 
                divSeat.appendChild(divHoleCards); //add divHoleCards to divSeat  

                divSemiCircle.setAttribute('class', 'leftSemiCircles');
                divNonCircle.setAttribute('class', 'nonCircleContMoveR');
                divNonCircle.appendChild(divSemiCircle);
                divNonCircle.appendChild(divRectangle);
                containerDiv.appendChild(divNonCircle);
                containerDiv.appendChild(divCircle);
            }
            else{//left to right playerDivs
                divHoleCards.setAttribute('class', 'holeCardsDivLtoR'); 
                divSeat.appendChild(divHoleCards); //add divHoleCards to divSeat  

                containerDiv.appendChild(divCircle);
                divNonCircle.setAttribute('class', 'nonCircleContMoveL');
                divNonCircle.appendChild(divRectangle);
                divSemiCircle.setAttribute('class', 'rightSemiCircles');
                divNonCircle.appendChild(divSemiCircle);
                containerDiv.appendChild(divNonCircle);
            }                 

            //containerDiv appended to divSeat
            divSeat.appendChild(containerDiv);

            //buttonSeat created and appended to divSeat
            const buttonSeat = document.createElement('button');
            const buttonText = document.createTextNode('Open Seat');
            buttonSeat.appendChild(buttonText);
            buttonSeat.setAttribute('id', 'buttonSeat'+ i.toString());
            buttonSeat.setAttribute('class', 'buttonSeats');
            divSeat.appendChild(buttonSeat);

            divSeats.appendChild(divSeat);
            document.getElementById('allActions').appendChild(actionDiv);

            //sets classNames for playerUsernamePs
            this.addPlayer('Player ' + i, i, 100 * this.blinds[1]);//set it up so playername also becomes usernameText
            
            divSeat.style.position = "relative";

            const idxSetCoordinates = idxOfCoordinates(this.size);
            if (twoto10MaxSeats[idxSetCoordinates].length >= i ){
                divSeat.style.left = twoto10MaxSeats[idxSetCoordinates][i-1][0];
                divSeat.style.top = twoto10MaxSeats[idxSetCoordinates][i-1][1];  
            }         
        }
    }
    addPlayer(PlayerName, seatNum, buyInAmt){
        document.getElementById('playerUsername' + seatNum.toString() + 'p' ).textContent = PlayerName; 
        let printedStack = parseFloat(buyInAmt).toFixed(2);
        if (printedStack.substring(printedStack.length - 3, printedStack.length) == '.00'){
            printedStack = printedStack.substring(0, printedStack.length - 3);
        }
        document.getElementById('chipStack'+ seatNum.toString() + 'p').textContent = "$" + printedStack;             
        this.table[seatNum - 1] = new Player(PlayerName, seatNum,  buyInAmt);          	          
    }    
    startGame(){
        
        if(!this.btnChosen){//button not chosen yet
            this.chooseButton();
        }
        else{        
            if (!this.btnAnimation){
                this.orderSeatsArray();
            }
            else{
                this.allInCounter = 0;
                this.playersInPot = this.activePlayersIdx.concat();

                this.board = [];   
                this.betAllInAmts = [];
                this.allPots = [];
                this.tempPots = [];     
                this.legalRaise = true;	 
                this.extraPot = false; 
                
                //code is not being synchronous use promise or something for code below
                this.deck = new Deck();
                this.deck.shuffle(); 

                const numPlayers = this.playersInPot.length;

                if (numPlayers >= 2){
                    
                    //deals two cards to each player and adds those images to the player's holeCardDiv
                    for (let i = 0; i < numPlayers; i++){                
                        const currentSeatIdx = this.playersInPot[i];
                        const currentDealtHand = [this.deck.deck.pop(), this.deck.deck.pop()];
                        this.table[currentSeatIdx].hand = currentDealtHand;  

                        const holeCardsDiv = document.getElementById('holeCards'+ (currentSeatIdx + 1) + 'div');
                        const holeCardsArr = holeCardsDiv.getElementsByTagName('div');
                        
                        holeCardsArr[1].textContent = '';
                        holeCardsArr[2].textContent = '';

                        holeCardsArr[1].appendChild(getHoleCardImg(currentDealtHand[0]));//image element of first hole card
                        holeCardsArr[2].appendChild(getHoleCardImg(currentDealtHand[1]));//image element of second hole card
                    }     

                    this.roundOver = false;
                    this.preFlop = true;
                    this.flop = false; 
                    this.turn = false;
                    this.river = false;
                    this.allRounds(); 
                }
            }
        }         
    }
    printPostBlinds(seatNum){
        const stack = parseFloat(this.table[seatNum - 1].stack);
        const allInBool = parseFloat(parseFloat(this.table[seatNum - 1].stack).toFixed(2)) <= parseFloat(parseFloat(this.betAmounts[0]).toFixed(2));
        
        let printedAmount;
        if (allInBool){
            printedAmount = stack.toFixed(2);
        }
        else{
            printedAmount = this.betAmounts[0];
        }

        betTextOutput(printedAmount, this.table.length, (seatNum - 1)); 
    }
    beforeNewHand(bustedOutArr){        

        //4 second delay so you can see winner
        setTimeout(()=>{
            const numBoardCards = document.getElementById('board').getElementsByTagName('div').length;
        
            document.getElementById('potChips').textContent = '';
            document.getElementById('allBestHands').textContent = '';

            //erases board cards
            for (let i = 0; i < numBoardCards; i++){
                document.getElementById('board').getElementsByTagName('div')[i].textContent = '';
            }

            //erases holeCards and buttonCard
            for (let i = 0; i < this.size; i++){
                const holdCards = document.getElementById('holeCards' + (i + 1) + 'div').getElementsByTagName('div');
                holdCards[0].textContent = '';
                holdCards[1].textContent = '';
                holdCards[2].textContent = '';

            }

            //splices busted out players from this.table
            for (let k = 0; k < bustedOutArr.length; k++){
                delete this.table[bustedOutArr[k]];
                this.activePlayersIdx.splice(this.activePlayersIdx.indexOf(bustedOutArr[k]), 1);

                //delete player from seat in gui too 
                document.getElementById('playerUsername'+ (bustedOutArr[k] + 1) + 'p').textContent = '';
                document.getElementById('playerAction'+ (bustedOutArr[k] + 1) + 'p').textContent = ''; 
                document.getElementById('chipStack'+ (bustedOutArr[k] + 1) + 'p').textContent = ''; 
            }

            document.getElementById('winnerText').textContent = 'Winner(s): ';
            document.getElementById('potText').textContent = '';

            this.clearPreviousBets(true);
            this.clearPreviousActions(true);
            this.btnAnimation = false;
            this.startGame();
        },4000);
    }
    allRounds(){
        if(this.preFlop){   
            if(!this.roundOver){
                this.tempPots = [];
                
                //button is supposed to be sb in heads up
                let sb =  this.playersInPot[0];
                let bb =  this.playersInPot[1];   

                //heads up button is sb
                if(this.playersInPot.length == 2){
                    sb =  this.playersInPot[1];
                    bb =  this.playersInPot[0];   
                }

                //sb and bb posted  
                this.betAmounts = [this.blinds[0]];  
                const sbSeat = sb + 1;
                displayArrChips(this.betAmounts[0], this.betAmounts, sbSeat, this.table.length);
                this.printPostBlinds(sbSeat);
                this.table[sb].callNoBetRound(this); 

                this.betAmounts = [this.blinds[1]];
                const bbSeat = bb + 1;
                displayArrChips(this.betAmounts[0], this.betAmounts, bbSeat, this.table.length);
                this.printPostBlinds(bbSeat);
                this.table[bb].callNoBetRound(this);
                
                this.betDifference = this.blinds[1];

                //sets lastToAct (you took antes into consideration here)
                if (this.table[bb].stack != 0){
                    this.lastToAct = bb; 
                }
                else{//bb all in
                    if (this.table[sb].stack != 0){
                        this.lastToAct = 0;
                    }
                    else{//sb all in too so end of playersInPot is last to act
                        this.lastToAct = this.playersInPot[this.playersInPot.length - 1];
                    }
                }
                
                if(this.playersInPot.length >= 2){
                    const bbIdx = this.playersInPot.indexOf(bb);
                    const preflopRound = new bettingRound(this);
                    preflopRound.roundLoop(this, bbIdx, this.playersInPot[1]);
                }
            }
            else{
                this.endOfRound();
                this.roundOver = false;
                this.preFlop = false;
                this.flop = true; 
                this.allRounds();
            }
        }
        else if (this.flop){  
            if(!this.roundOver){     
                this.board.push(this.deck.deck.pop(), this.deck.deck.pop(), this.deck.deck.pop());

                //adds card images to boardDiv                
                document.getElementById('board').getElementsByTagName('div')[0]
                .appendChild(getHoleCardImg(this.board[0]));
                document.getElementById('board').getElementsByTagName('div')[1]
                .appendChild(getHoleCardImg(this.board[1]));
                document.getElementById('board').getElementsByTagName('div')[2]
                .appendChild(getHoleCardImg(this.board[2]));        
                
                this.storeHandCombos();
                this.findsAllBestHands();
                this.printAllBestHands();    

                this.lastToAct = this.playersInPot[this.playersInPot.length - 1];//end of array

                //when it returns true, then that round is over
                const flopRound = new bettingRound(this);
                flopRound.roundLoop(this, -1, -1);
            }
            else{
                this.endOfRound();
                this.roundOver = false;
                this.flop = false;
                this.turn = true; 
                this.allRounds();
            }    
        }
        else if (this.turn){
            if(!this.roundOver){
                this.board.push(this.deck.deck.pop());
                document.getElementById('board').getElementsByTagName('div')[3]
                .appendChild(getHoleCardImg(this.board[3]));

                this.storeHandCombos();
                this.findsAllBestHands();
                this.printAllBestHands();                   
                
                this.lastToAct = this.playersInPot[this.playersInPot.length - 1];//end of array

                //when it returns true, then that round is over
                const turnRound = new bettingRound(this);
                turnRound.roundLoop(this, -1, -1);
            }
            else{   
                this.endOfRound();
                this.roundOver = false;
                this.turn = false;
                this.river = true;
                this.allRounds();
            }      
        }
        else if (this.river){
            if(!this.roundOver){
                this.board.push(this.deck.deck.pop());
                document.getElementById('board').getElementsByTagName('div')[4]
                .appendChild(getHoleCardImg(this.board[4]));

                this.storeHandCombos();
                this.findsAllBestHands();
                this.printAllBestHands();

                this.lastToAct = this.playersInPot[this.playersInPot.length - 1];//end of array

                //when it returns true, showdown and reward winner then start new hand
                const riverRound = new bettingRound(this);
                riverRound.roundLoop(this, -1, -1);
            }
            else{
                //showdown 
                this.clearPreviousBets();
                this.noMoreBetting();
            }   
        }  
    }
    storeHandCombos(){//finds all 5 card combos and stores for each player
        for(let j = 0; j < this.size; j++){
            if (this.table[j] != undefined){
                this.table[j].handCombos = [];
                if (this.table[j].hand.length != 0){
                    if(this.flop){
                        //3 board cards + flop
                        let handCombo = this.board.concat();
                        handCombo.push(this.table[j].hand.concat()[0], this.table[j].hand.concat()[1]);
                        const handToPush = handCombo.concat();
                        this.table[j].handCombos.push(handToPush);                   
                        this.table[j].finalHand = [handToPush, getHandType(handToPush)];
                    }
                    else if(this.turn){
                        this.table[j].handCombos = [];
                        
                        //4 cards + 1 hole card
                        for (let i = 0; i < 4; i++){
                            let handCombo = this.board.concat();                  

                            //adds 1st hole card
                            handCombo.push(this.table[j].hand.concat()[0]);
                            this.table[j].handCombos.push(handCombo.concat());
                            
                            //adds 2nd hole card 
                            handCombo.pop();
                            handCombo.push(this.table[j].hand.concat()[1]);
                            this.table[j].handCombos.push(handCombo.concat());                                        
                        }

                        //3 card board + 2 hole card
                        for (let i = 0; i < 4; i++){
                            
                            //takes away 1 card at index i
                            let handCombo = this.board.concat();
                            handCombo.splice(i, 1);                  
                
                            //adds both hole cards
                            handCombo.push(this.table[j].hand.concat()[0], this.table[j].hand.concat()[1]);
                            this.table[j].handCombos.push(handCombo.concat());                                                                                     
                                                                
                        }
                    }
                    else{//this.river     
                        //5 card board (no hole cards)
                        this.table[j].handCombos.push(this.board.concat());
                        
                        //4 card board + 1 hole card
                        for (let i = 0; i < 5; i++){
                            //take away index i
                            let handCombo = this.board.concat();
                            handCombo.splice(i, 1);

                            //adds 1st hole card to remaining 4
                            handCombo.push(this.table[j].hand.concat()[0]);
                            this.table[j].handCombos.push(handCombo.concat());
                            
                            //adds 2nd hole card to remaining 4
                            handCombo.pop();
                            handCombo.push(this.table[j].hand.concat()[1]);
                            this.table[j].handCombos.push(handCombo.concat());                                        
                        }
                        
                        //3 card board + 2 hole card
                        for (let i = 0; i < 5; i++){
                            
                            //takes away 1st card at index i
                            let handCombo = this.board.concat();
                            handCombo.splice(i, 1); 

                            //i = 0, can do k = 0...
                            //i = 1, can do k = 1...
                            
                            //takes away 2nd card at index j
                            for(let k = 0; k < 4; k++){
                                if(k >= i){
                                    let tempHandCombo = handCombo.concat();
                                    tempHandCombo.splice(k, 1); 
                
                                    //adds both hole cards
                                    tempHandCombo.push(this.table[j].hand.concat()[0], this.table[j].hand.concat()[1]);
                                    this.table[j].handCombos.push(tempHandCombo.concat());  
                                }                                                           
                            }                                        
                        }
                    }
                }
            }
        }
    }
    playersStillIn(){
        let outputArr = [];
        
        for (let i = 0; i < this.allPots.length; i++){
            const currentPotArr = this.allPots[i];

            for (let j = 0; j < currentPotArr.length; j++){
                outputArr = outputArr.concat(currentPotArr[j].allInsIdx);
            }
        }

        for (let i = 0; i < this.tempPots.length; i++){
            outputArr = outputArr.concat(this.tempPots[i].allInsIdx);
        }
        outputArr = outputArr.concat(this.playersInPot.concat());

        return outputArr;
    }
    findsAllBestHands(){
        //finds best hand combo and its type for each player

        const stillIn = this.playersStillIn();
        for (let i = 1; i <= stillIn.length; i++){
            const currentIdx = stillIn[i - 1];
            const currentPlayer = this.table[currentIdx];
            const currentPlayerCombos = currentPlayer.handCombos;
            
            let winnerSoFar;
            if((!this.flop)){
                this.table[currentIdx].finalHand = [];
            }

            //finds winner of all combos for current player 
            if((!this.flop) && (!this.preFlop) && (currentPlayer.hand.length != 0)){
                for (let k = 0; k <= currentPlayerCombos.length - 2; k++){//length - 2 because you use k+1
                    if (k == 0){
                        winnerSoFar = winningHand(currentPlayerCombos[0].concat(), currentPlayerCombos[1].concat()); 
                    }
                    else{                                        
                        winnerSoFar = winningHand(winnerSoFar[0].concat(), currentPlayerCombos[k + 1].concat(), 
                        winnerSoFar[1].concat());
                    }                                        
                }            
                this.table[currentIdx].finalHand = winnerSoFar; 
            }
        }
    }
    printAllBestHands(){
        document.getElementById('allBestHands').textContent = '';
        const idxSetCoordinates = idxOfCoordinates(this.table.length);

        const stillIn = this.playersStillIn();

        for(let i = 0; i < stillIn.length; i++){       
            const currentIdx = stillIn[i];
            const currentBestHand = document.createElement('div');

            currentBestHand.appendChild(document.createTextNode((convertTypeValToStr(this.table[currentIdx].finalHand[1]))));
        
            currentBestHand.style.position = "absolute";
            const playerNum = currentIdx + 1;           
            currentBestHand.setAttribute('id', 'bestHandSeat' + playerNum);
            currentBestHand.setAttribute('class', 'bestHandDivs');
            document.getElementById('allBestHands').appendChild(currentBestHand);

            if (bestHandsAllSizes[idxSetCoordinates].length >= playerNum ){
                currentBestHand.style.left = bestHandsOutput(idxSetCoordinates, currentIdx, currentBestHand.offsetWidth);
                currentBestHand.style.top = bestHandsAllSizes[idxSetCoordinates][currentIdx][1];  
            }              
        }   
    }
    chooseButton(){//choose btn by dealing one card to each active player and highest is dealer
        
        const btnDeck = new Deck();
        btnDeck.shuffle();

        let higherCard;
        let higherCardBoolean = false;

        for(let i = 0; i < this.size; i++){
            const currentPlayer = this.table[i]; // returns PlayerObj
            const currentCardDiv = document.getElementById('holeCards'+ (i + 1) + 'div'); 
            const currentBtnCardDiv = document.getElementById('buttonCard' + (i + 1) + 'Div');
            
            //hides holeCards and shows BtnCard
            currentCardDiv.
            getElementsByClassName('holeCards')[0].style.display = "none";
            currentCardDiv.getElementsByClassName('holeCards')[1].style.display = "none";
            currentBtnCardDiv.style.display = "flex";
            
            if (!higherCardBoolean){
                currentPlayer.btnCard.push(btnDeck.deck.pop()); 	
                currentBtnCardDiv.appendChild(getHoleCardImg(currentPlayer.btnCard[0]));
                
                if (i == 0){ //set initial value of higherCard
                    higherCard = [currentPlayer.btnCard[0], i];
                }
                else { //compare higher card to current card we're on            
                    if(currentPlayer.btnCard[0].value > higherCard[0].value){
                        higherCard = [currentPlayer.btnCard[0], i];
                    }
                    else if(currentPlayer.btnCard[0].value == higherCard[0].value){//compare suits
                        const higherCardSuitNum = convertSuitToNum(higherCard[0].suit);
                        const currentCardSuitNum = convertSuitToNum(currentPlayer.btnCard[0].suit);
    
                        if(currentCardSuitNum > higherCardSuitNum){
                            higherCard = [currentPlayer.btnCard[0], i];
                        }                            
                    }

                    if(i == (this.size - 1)){
                        higherCardBoolean = true;
                        this.button = higherCard[1]; //seatNum
                        moveButton(this.button, -1, this.table.length, this);                          
                        i = -1;
                        this.btnChosen = true;
                        higherCard = []; //delete garbage
                    }
                }
            }
            else{//clear up, make holeCards visibile and hide and remove buttonCards               

                setTimeout(()=>{                    
                    //hides btnCard and shows holeCards
                    for(let j = 0; j < this.size; j++){
                        const currentPlayer = this.table[j]; // returns PlayerObj
                        const currentCardDiv = document.getElementById('holeCards'+ (j + 1) + 'div'); 
                        const currentBtnCardDiv = document.getElementById('buttonCard' + (j + 1) + 'Div');

                        currentBtnCardDiv.textContent = '';
                        currentBtnCardDiv.style.display = "none";
                        currentPlayer.btnCard = [];
                        currentCardDiv.getElementsByClassName('holeCards')[0].style.display = "flex";
                        currentCardDiv.getElementsByClassName('holeCards')[1].style.display = "flex";
                    }
                    this.startGame();

                }, 3000);
                break;
            }            
        }
    }
    orderSeatsArray(){//creates new array of order in which sb and bb are first, button last using initialButtonIdx (use only for first ordered seats)

        if(!this.orderedBool){//ordered seats not executed once, first and final execution here

            let i = this.button + 1;
            //i set to button + 1 (below makes sure within range)
            if (i > (this.size - 1)){
                i = 0;
            }     

            let tempArr = [];
            for (i; i < this.size; i++){    
                tempArr.push(i);

                if (i == this.button){
                    break;
                }
                else if (i == (this.size - 1)){
                    i = -1;
                } 
            }
            this.activePlayersIdx = tempArr;
            this.orderedBool = true;
            this.btnAnimation = true;
            this.startGame();
        }
        else{//update activePlayersIdx + 1, which is insert sb to end of array
            if (this.activePlayersIdx.length >= 1){
                moveButton(this.activePlayersIdx[0], this.activePlayersIdx[this.activePlayersIdx.length - 1], this.table.length, this);
            }
        }
    }
    calculatePots(){//add later so than you can display pot(s)
        //go thru elements of betAllInAmts and calculate Pots at same idx (after sorting)

        let potIdx = this.tempPots.length - 1;
        let potIteration = 0;
        let previousAllIn = 0;

        for (let i = this.betAllInAmts.length - 1; i >= 0; i--){
            const currentAmt =  this.betAllInAmts[i];
            const currentPot = this.tempPots[potIdx];   

            if (currentAmt.allInBool){//allIn increments potIdx, otherwise potIdx stays the same

                currentPot.changeBetAmt(currentAmt.betAmount);

                if (potIteration == 0){
                    currentPot.setTotal(parseFloat(parseFloat((currentAmt.overallCount * parseFloat(parseFloat(currentAmt.betAmount - previousAllIn).toFixed(2)))).toFixed(2))
                    + parseFloat(parseFloat(currentPot.initialPot).toFixed(2)));
                }
                else{//supposed to add betAmount if previous bet wasn't all in
                    currentPot.addToPot(parseFloat(parseFloat(parseFloat(parseFloat(currentAmt.overallCount).toFixed(2)) * parseFloat(parseFloat(currentAmt.betAmount - previousAllIn).toFixed(2))).toFixed(2)));
                }

                potIdx = potIdx - 1;

                potIteration = 0;
                previousAllIn = currentAmt.betAmount;
            }
            else{
                if (potIteration == 0){
                    currentPot.setTotal(parseFloat(parseFloat(currentPot.initialPot).toFixed(2)));
                }

                currentPot.addToPot(parseFloat(parseFloat(currentAmt.overallCount).toFixed(2)) * parseFloat(parseFloat(currentAmt.betAmount - previousAllIn).toFixed(2)));
                
                potIteration = potIteration + 1;

                if(i == 0){
                    currentPot.changeBetAmt(currentAmt.betAmount);
                }
            }
        }

        let potCounter = 0;
        const tempNAllPots = this.allPots.concat();
        tempNAllPots.unshift(this.tempPots.concat());
        let totalAmt = 0;

        //iterate through allPots then tempPots start at end for earliest pots
        for (let i = tempNAllPots.length - 1; i >=0; i--){
            const currentPotArr = tempNAllPots[i];
            for (let j = currentPotArr.length - 1; j >=0; j--){

                totalAmt = totalAmt + currentPotArr[j].total;

                if ((i == tempNAllPots.length - 1) && (j == currentPotArr.length - 1)){
                    //mainPot

                    let printedTotal = parseFloat(currentPotArr[j].total).toFixed(2);
                    if (printedTotal.substring(printedTotal.length - 3, printedTotal.length) == '.00'){
                        printedTotal = printedTotal.substring(0, printedTotal.length - 3);
                    }
                    
                    document.getElementById('potText').textContent = "Main Pot: " + printedTotal;
                }
                else{
                    potCounter++;//side
                    const previousTxt = document.getElementById('potText').textContent;

                    let printedTotal = parseFloat(currentPotArr[j].total).toFixed(2);
                    if (printedTotal.substring(printedTotal.length - 3, printedTotal.length) == '.00'){
                        printedTotal = printedTotal.substring(0, printedTotal.length - 3);
                    }

                    document.getElementById('potText').textContent = previousTxt + ", Side Pot " + potCounter + ': ' + printedTotal;
                }

                if ((i == 0) && (j == 0)){//iterated through all pots
                    let printedTotal = parseFloat(totalAmt).toFixed(2);
                    if (printedTotal.substring(printedTotal.length - 3, printedTotal.length) == '.00'){
                        printedTotal = printedTotal.substring(0, printedTotal.length - 3);
                    }
                    document.getElementById('potText').textContent = "Total: " + printedTotal + ' ' + document.getElementById('potText').textContent;
                }
            }
        }
    }
    sortPots(){//descending
        this.tempPots.sort(function(a, b){return b.betAmount - a.betAmount});
    }
    sortBetAmts(){//descending
        this.betAllInAmts.sort(function(a, b){return b.betAmount - a.betAmount});
    }
    endOfRound(){
        this.betAllInAmts = [];

        if (this.extraPot){
            this.allPots.unshift(this.tempPots);//inserts tempPots in beginning of allPots
            this.tempPots = [new Pot(0)];
            this.extraPot = false;
        }
        else{
            this.tempPots[0].initialPot = this.tempPots[0].total;
            let tempArr = [this.tempPots[0]];
            this.tempPots.splice(0, 1);
            if (this.tempPots.length != 0){
                this.allPots.unshift(this.tempPots.concat());
            }
            this.tempPots = tempArr;
        }
    }
    updateLastToAct(inputSeat){//will set seat before inputSeat in playersInPot as lastToAct
        const currentIdx = this.playersInPot.indexOf(inputSeat);
        if ((currentIdx - 1) < 0){
            this.lastToAct = this.playersInPot[this.playersInPot.length - 1];
        }
        else{
            this.lastToAct = this.playersInPot[currentIdx - 1];
        }
    }
    addToOutermostPot(amountToAdd){//add later so than you can display pot(s)
        this.tempPots[0].addToPot(amountToAdd);

        let potCounter = 0;
        const tempNAllPots = this.allPots.concat();
        tempNAllPots.unshift(this.tempPots.concat());
        let totalAmt = 0;

        //iterate through allPots then tempPots start at end for earliest pots
        for (let i = tempNAllPots.length - 1; i >=0; i--){
            const currentPotArr = tempNAllPots[i];
            for (let j = currentPotArr.length - 1; j >=0; j--){

                totalAmt = totalAmt + currentPotArr[j].total;

                if ((i == tempNAllPots.length - 1) && (j == currentPotArr.length - 1)){
                    //mainPot

                    let printedTotal = parseFloat(currentPotArr[j].total).toFixed(2);
                    if (printedTotal.substring(printedTotal.length - 3, printedTotal.length) == '.00'){
                        printedTotal = printedTotal.substring(0, printedTotal.length - 3);
                    }
                    
                    document.getElementById('potText').textContent = "Main Pot: " + printedTotal;
                }
                else{
                    potCounter++;//side
                    const previousTxt = document.getElementById('potText').textContent;

                    let printedTotal = parseFloat(currentPotArr[j].total).toFixed(2);
                    if (printedTotal.substring(printedTotal.length - 3, printedTotal.length) == '.00'){
                        printedTotal = printedTotal.substring(0, printedTotal.length - 3);
                    }

                    document.getElementById('potText').textContent = previousTxt + ", Side Pot " + potCounter + ': ' + printedTotal;
                }

                if ((i == 0) && (j == 0)){//iterated through all pots
                    let printedTotal = parseFloat(totalAmt).toFixed(2);
                    if (printedTotal.substring(printedTotal.length - 3, printedTotal.length) == '.00'){
                        printedTotal = printedTotal.substring(0, printedTotal.length - 3);
                    }
                    document.getElementById('potText').textContent = "Total: " + printedTotal + ' ' + document.getElementById('potText').textContent;
                }
            }
        }
    }
    noMoreBetting(){//everyone is all in(maybe except 1) or river showdown
        //means outermost pot not really a pot
        document.getElementById('action').style.display = "none";
        
        if((this.playersInPot.length == 1) && (this.tempPots[0].allInsIdx.length == 0)){
            //give chips back immediately before another card is dealt
            const lastPlayerStandingIdx = this.playersInPot[0];
            this.table[lastPlayerStandingIdx].stack = parseFloat(parseFloat(Math.round((parseFloat(this.table[lastPlayerStandingIdx].stack + this.tempPots[0].total) + Number.EPSILON) * 100) / 100).toFixed(2));					
            this.betAllInAmts.splice(0, 1);
            this.tempPots.splice(0, 1);

            let printedStack = parseFloat(this.table[lastPlayerStandingIdx].stack).toFixed(2);
            if (printedStack.substring(printedStack.length - 3, printedStack.length) == '.00'){
                printedStack = printedStack.substring(0, printedStack.length - 3);
            }
            document.getElementById('chipStack'+ (lastPlayerStandingIdx + 1) + 'p').textContent = "$" + printedStack;    
            
            this.calculatePots();		
            displayPotChips(this);
        }

        if(this.preFlop){
            this.board.push(this.deck.deck.pop(), this.deck.deck.pop(), this.deck.deck.pop(),
            this.deck.deck.pop(), this.deck.deck.pop());

            //adds card images to boardDiv            
            document.getElementById('board').getElementsByTagName('div')[0]
            .appendChild(getHoleCardImg(this.board[0]));
            document.getElementById('board').getElementsByTagName('div')[1]
            .appendChild(getHoleCardImg(this.board[1]));
            document.getElementById('board').getElementsByTagName('div')[2]
            .appendChild(getHoleCardImg(this.board[2]));   
            document.getElementById('board').getElementsByTagName('div')[3]
            .appendChild(getHoleCardImg(this.board[3]));   
            document.getElementById('board').getElementsByTagName('div')[4]
            .appendChild(getHoleCardImg(this.board[4]));   
        }
        else if(this.flop){
            this.board.push(this.deck.deck.pop(), this.deck.deck.pop());

            //adds card images to boardDiv            
            document.getElementById('board').getElementsByTagName('div')[3]
            .appendChild(getHoleCardImg(this.board[3]));   
            document.getElementById('board').getElementsByTagName('div')[4]
            .appendChild(getHoleCardImg(this.board[4]));   
        }
        else if(this.turn){
            this.board.push(this.deck.deck.pop());

            //adds card images to boardDiv           
            document.getElementById('board').getElementsByTagName('div')[4]
            .appendChild(getHoleCardImg(this.board[4]));   
        }
        
        this.preFlop = false;
        this.flop = false;
        this.turn = false;
        this.river = false;
        
        this.storeHandCombos();
        this.findsAllBestHands();
        this.printAllBestHands();
        
        const leftStanding = this.playersInPot.length;
        if (leftStanding == 0){
            this.winnersOfAllPots(true);
        }
        else{//at least 1
            this.winnersOfAllPots();
        }                       
    }
    winnersOfAllPots(allAllIn = false){//works with at least 1 player still standing

        this.allPots.unshift(this.tempPots.concat());  
        this.storeHandCombos();
        this.findsAllBestHands();
        
        let currentPot;
        let winnerIdx;
        let bustedOutArr = [];
        let bustedBool;
        let firstIdx = 0;
        let secondIdx;
        let i;

        let outerNoAllIns = false; 
        if (this.allPots[firstIdx][0].allInsIdx.length == 0){
            outerNoAllIns = true;
        }
                
        if(allAllIn){//no playersInPot, everyone's all in
            winnerIdx = [this.allPots[firstIdx][0].allInsIdx[0]];//first seat in first pot in first array of allPots
            bustedBool = true;
            currentPot = this.allPots[firstIdx][0].allInsIdx;
            secondIdx = 1; //means second pot in first array of allPots
            i = 1;
        }
        else{
            if(this.playersInPot.length > 1){
                currentPot = this.playersInPot;
                secondIdx = 0;
                i = 1;
            }
            else{//playersInPot.length == 1
                currentPot = this.allPots[firstIdx][0].allInsIdx;
                secondIdx = 1; //means second pot in first array of allPots  
                i = 0;        
            }
            bustedBool = false;
            winnerIdx = [this.playersInPot[0]];
        }

        let numPots = 0;
        for (let i = 0; i < this.allPots.length; i++){
            numPots = this.allPots[i].length + numPots;//array of Pots
        }

        let sidePotNum = numPots - 1;

        //supposed to be in reverse order
        for (i; i < currentPot.length; i++){ 
            const previousIdx = winnerIdx[0];               
            const previousWinner = this.table[previousIdx].finalHand;

            const currentIdx = currentPot[i];
            const currentPlayer = this.table[currentIdx].finalHand;
            
            const winner = winningHand(previousWinner[0], currentPlayer[0], previousWinner[1], currentPlayer[1]);

            //sets winnerIdx array and busted out array
            if(!(compareHands(winner, previousWinner))){//currentPlayer winner, previousWinner/Player loser
                winnerIdx = [currentIdx];

                if(bustedBool){
                    bustedOutArr.push(previousIdx);
                }  
                if(i == 0){//i = 0 instead of i = 1 after playersInPot is finished iterating through                    
                    bustedBool = true;
                }                              
            }
            else{//previousPlayer winner, could also mean current player won too
                if(compareHands(winner, currentPlayer)){
                    winnerIdx.push(currentIdx);
                }
                else{
                    if ((secondIdx > 0)){                       
                        bustedOutArr.push(currentIdx);
                    }    
                }         
            }

            if(i == (currentPot.length - 1)){//reached end of pot

                //award current pot to player(s) since you're no longer in playersInPot
                if((secondIdx > 0) || (this.allInCounter == 0) || outerNoAllIns){                 
                    const winnerIdxSz = winnerIdx.length;
                    
                    //sets potSecondIdx since you made secondIdx +1 for next pot
                    let potSecondIdx;                    
                    if (secondIdx > 0){
                        potSecondIdx = secondIdx - 1;
                    }
                    else{
                        potSecondIdx = 0;
                    }

                    //make sure you implement rule for when it's uneven
                    const isDecimal = ((this.allPots[firstIdx][potSecondIdx].total)%1) != 0;
                    let potTotal = this.allPots[firstIdx][potSecondIdx].total;

                    console.log(potTotal)
                    console.log('firstIdx ' + firstIdx)
                    console.log('potSecondIdx ' + potSecondIdx)
                    console.log(JSON.stringify(this.allPots))

                    let leftOver = 0;
                    if (isDecimal){//is decimal
                        leftOver = parseFloat((((this.allPots[firstIdx][potSecondIdx].total * 100) % winnerIdxSz)/100).toFixed(2));
                        if (leftOver != 0){
                            potTotal = parseFloat(parseFloat(potTotal - leftOver).toFixed(2));
                        }
                    }

                    const leftOverNotRounded = leftOver/winnerIdxSz;
                    const someLeftOverDivided = parseFloat(leftOverNotRounded.toFixed(2));
                    potTotal = parseFloat((potTotal + parseFloat((someLeftOverDivided*winnerIdxSz).toFixed(2))));
                    const unevenLeftOver = parseFloat(((leftOverNotRounded - parseFloat(leftOverNotRounded.toFixed(2)))*winnerIdxSz).toFixed(2));

                    let numToDivide = winnerIdxSz - 1;

                    while (numToDivide > 0){
                        if (((unevenLeftOver * 100) % numToDivide) != 0){//remainder
                            numToDivide--;
                        }
                        else{//no remainder
                            break;
                        }
                    }

                    if (numToDivide == 0){//so not undefined below, never will hit 0 above since x% 1 always 0
                        numToDivide = 1;
                    }                    

                    const unevenDivided = parseFloat((unevenLeftOver/numToDivide).toFixed(2)); 

                    let playerCounter = 0;                                       
                    
                    //rewards uneven leftover in order with respect to button
                    for (let i = 0; i < this.activePlayersIdx.length; i++){
                        for (let j = 0; j < winnerIdxSz; j++){
                            if(this.activePlayersIdx[i] == winnerIdx[j]){
                                playerCounter++;
                                this.table[this.activePlayersIdx[i]].stack = this.table[this.activePlayersIdx[i]].stack + unevenDivided;

                                if(playerCounter == numToDivide){//breaks nested loop
                                    i = 100;
                                    j = 100;
                                }
                            }
                        }
                    }

                    //creates winnerString without comma in end and reward pot here
                    let winnerString = '';
                    for (let j = 0; j < winnerIdxSz; j++){   

                        this.table[winnerIdx[j]].stack = parseFloat(parseFloat(Math.round((parseFloat(this.table[winnerIdx[j]].stack + ((potTotal)/winnerIdxSz)) + Number.EPSILON) * 100) / 100).toFixed(2));

                        let printedStack = parseFloat(this.table[winnerIdx[j]].stack).toFixed(2);
                        if (printedStack.substring(printedStack.length - 3, printedStack.length) == '.00'){
                            printedStack = printedStack.substring(0, printedStack.length - 3);
                        }
                        document.getElementById('chipStack'+ (winnerIdx[j] + 1) + 'p').textContent = "$" + printedStack;    

                        if(winnerString == ''){
                            winnerString = winnerString + 'Seat ' + (winnerIdx[j] + 1);
                        }
                        else{
                            winnerString = winnerString + ', Seat ' + (winnerIdx[j] + 1);
                        }
                    }
                    
                    const previousTxt = document.getElementById('winnerText').textContent;
                    if (sidePotNum != 0){
                        document.getElementById('winnerText').textContent = 'Winner(s): ' + 'Side Pot ' + sidePotNum + ': ' + winnerString + ', ' + previousTxt.substring(11);
                    }
                    else{
                        document.getElementById('winnerText').textContent = 'Winner(s): ' + 'Main Pot: ' + winnerString + ', ' + previousTxt.substring(11);
                    }
                    sidePotNum--;
                }

                if ((secondIdx - 1) < (this.allPots[firstIdx].length - 1)){//secondIdx represents pot in array of pots
                    currentPot = this.allPots[firstIdx][secondIdx].allInsIdx;
                    secondIdx = secondIdx + 1;         
                    i = -1; 
                }
                else{//means you just finished last pot in current array of pots
                    if((firstIdx + 1) < this.allPots.length){//current array of pots
                        firstIdx = firstIdx + 1;                    
                        currentPot = this.allPots[firstIdx][0].allInsIdx;
                        secondIdx = 1;
                        i = -1;
                    }
                    else{
                        this.clearPreviousActions(true);
                    }
                }                
            }
        }

        this.beforeNewHand(bustedOutArr);
    }
    clearPreviousBets(allPlayers = false){
        if(allPlayers){
            let playerCount = 0;
            let tableSz = this.table.length;
            for (let i = 0; i < tableSz; i++){
                if (this.table[i] != undefined){
                    this.table[i].previousBet = 0;
                    playerCount++;

                    if(playerCount == tableSz){
                        break;
                    }
                }
            }
        }
        else{
            for (let i = 0; i < this.playersInPot.length; i++){
                this.table[this.playersInPot[i]].previousBet = 0;
            }
        }
    }    
    clearPreviousActions(noMoreAction = false){//make sure you do this for players not in pot but are all in
        if (!noMoreAction){//only deletes players in pot actionText and also deletes all chips
            for (let i = 0; i < this.playersInPot.length; i++){
                const actionDivText = document.getElementById('action'+ (this.playersInPot[i] + 1) + 'Text');
                actionDivText.textContent = '';
                actionDivText.style.display = "none";
            }
            const chipsArr = document.getElementsByClassName('betStacks');
            let i = 0;
            while(i < chipsArr.length){//removes all bets
                chipsArr[0].remove();
            }
        }
        else{//deletes everyone's chips and actionText
            for (let i = 1; i <= this.size; i++){
                const actionDiv = document.getElementById('action'+ i + 'Div');
                if (actionDiv.getElementsByClassName('betStacks')[0] != null){
                    actionDiv.removeChild(actionDiv.getElementsByClassName('betStacks')[0]);
                }

                const actionDivText = document.getElementById('action' + i + 'Text');
                actionDivText.textContent = '';
                actionDivText.style.display = "none";
            }
        }
    }    
}

module.exports = {
	CashGame: CashGame
}
