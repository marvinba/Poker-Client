const {Card} = require('./Card.js');
const betAllInAmt = require('./betAllInAmt.js');
const Pot =  require('./Pot.js');
const {idxOfCoordinates, bestActionOutput, displayArrChips, betTextOutput} = require('./Coordinates and Chips.js');

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

class Player {	
	constructor(name, seatNum, stackAmount){		
		this.name = name;
		this.seat = seatNum;
		this.btnCard = [];
		this.hand = []; 
		this.handCombos = [];
		this.finalHand = [];	
		this.stack = stackAmount;
		this.previousBet = 0;
		this.deductPreviousBet = this.deductPreviousBet.bind(this);
	}
	action(cashGameObj, betRoundObj, currentIdx){
		const seatCircle = document.getElementById('seat'+ (this.seat) + 'Div').getElementsByClassName("divCircles")[0]; 

		document.getElementById('timer').textContent = "Timer: 30";
		seatCircle.style.borderColor = "rgb(128, 128, 128)";
		document.getElementById('action').style.display = "flex";

		this.regTimer = setTimeout(()=>{
			if (cashGameObj.betAmounts[0] != 0){
				if(this.previousBet == cashGameObj.betAmounts[0]){//bb					
					const actionParent = document.getElementById('action'+ this.seat + 'Div');
					actionParent.style.display = "flex";

					const actionDiv = document.getElementById('action'+ this.seat + 'Text');
					actionDiv.textContent = '';
					actionDiv.style.display = "inline-block";
					actionDiv.style.position = "absolute";

					actionDiv.appendChild(document.createTextNode('Check'));

					const idxSetCoordinates = idxOfCoordinates(cashGameObj.table.length);
					const seatIdx = this.seat - 1;
					actionDiv.style.left = bestActionOutput(idxSetCoordinates, seatIdx, actionDiv.offsetWidth);
					actionDiv.style.top = bestActionsAllSizes[idxSetCoordinates][seatIdx][1];  

					this.check(cashGameObj, betRoundObj, currentIdx);

					clearTimeout(this.regTimer);
					clearInterval(this.countdown);
				}
				else{					
					const actionParent = document.getElementById('action'+ this.seat + 'Div');
					actionParent.style.display = "flex";

					const actionDiv = document.getElementById('action'+ this.seat + 'Text');
					actionDiv.textContent = '';
					actionDiv.style.display = "inline-block";
					actionDiv.style.position = "absolute";

					actionDiv.appendChild(document.createTextNode('Fold'));

					const idxSetCoordinates = idxOfCoordinates(cashGameObj.table.length);
					const seatIdx = this.seat - 1;
					actionDiv.style.left = bestActionOutput(idxSetCoordinates, seatIdx, actionDiv.offsetWidth);
					actionDiv.style.top = bestActionsAllSizes[idxSetCoordinates][seatIdx][1];  

					this.fold(cashGameObj, betRoundObj, currentIdx);

					clearTimeout(this.regTimer);
					clearInterval(this.countdown);
				}
			}
			else{				
				const actionParent = document.getElementById('action'+ this.seat + 'Div');
				actionParent.style.display = "flex";

				const actionDiv = document.getElementById('action'+ this.seat + 'Text');
				actionDiv.textContent = '';
				actionDiv.style.display = "inline-block";
				actionDiv.style.position = "absolute";

				actionDiv.appendChild(document.createTextNode('Check'));

				const idxSetCoordinates = idxOfCoordinates(cashGameObj.table.length);
				const seatIdx = this.seat - 1;
				actionDiv.style.left = bestActionOutput(idxSetCoordinates, seatIdx, actionDiv.offsetWidth);
				actionDiv.style.top = bestActionsAllSizes[idxSetCoordinates][seatIdx][1];  

				this.check(cashGameObj, betRoundObj, currentIdx);

				clearTimeout(this.regTimer);
				clearInterval(this.countdown);
			}
		}, 30000); //set up later	
		
		let timer = 30;
		this.countdown = setInterval(()=>{//setup blinking circle here
			timer--;

			if (timer%2!=0){//odd, white
				seatCircle.style.borderColor = "white";
			}
			else{//even, gray
				seatCircle.style.borderColor = "rgb(128, 128, 128)";
			}

			if(timer >= 0){
				document.getElementById('timer').textContent = "Timer: " + timer;
			}
			else{
				clearInterval(this.countdown);
			}
		}, 1000)

		const callButton = document.getElementById("callBtn");	
		const checkButton = document.getElementById("chkBtn");
		const raiseButton = document.getElementById("rzBtn");
		const foldButton = document.getElementById("foldBtn");	
		const betButton = document.getElementById("betBtn");
		const rangeSlider = document.getElementById("betRaiseRange");
		const textBox = document.getElementById('betRzText');

		callButton.style.display = "none";
		checkButton.style.display = "none";
		raiseButton.style.display = "none";
		foldButton.style.display = "none";
		betButton.style.display = "none";
		rangeSlider.style.display = "none";
		textBox.style.display = 'none';

		//have to removeEventListeners before add cuz you previous event listeners are still there
		if(cashGameObj.betAmounts[0] == 0){//no bet/raise in front so check and bet buttons shown (after preflop since it's always at least 1 BB action for each player!!!)

			//set bet rangeSlider min, max, and defaultValue 
			if(this.stack < cashGameObj.blinds[1]){//if stack is less than minimum bet of 1 BB
				rangeSlider.min = this.stack;				
				rangeSlider.max = this.stack;
				rangeSlider.value = this.stack;
			}
			else{//stack is equal to or greater than 1 BB
				rangeSlider.min = cashGameObj.blinds[1];			
				rangeSlider.max = this.stack;
				rangeSlider.value = cashGameObj.blinds[1];
			}

			let sliderDefault = parseFloat(rangeSlider.value).toFixed(2);
			if (sliderDefault.substring(sliderDefault.length - 3, sliderDefault.length) == '.00'){
				sliderDefault = sliderDefault.substring(0, sliderDefault.length - 3);
			}
			betButton.innerHTML = "Bet " + sliderDefault; //Bet button text to include range's defaultValue		
			
			this.rangeFunction = () => {
				let sliderValue = parseFloat(rangeSlider.value).toFixed(2);
				if (sliderValue.substring(sliderValue.length - 3, sliderValue.length) == '.00'){
					sliderValue = sliderValue.substring(0, sliderValue.length - 3);
				}
				betButton.innerHTML = "Bet " + sliderValue;	
			}	
			rangeSlider.addEventListener('input', this.rangeFunction);

			this.restrictText = (evt) =>{
				let str = document.getElementById('betRzText').value;
				const lastKey = str[str.length - 1];

				if((lastKey >= '0')&&(lastKey <= '9')){
					if(str.match(/\.\d{3,}$/) != null){//check to see if 2 digits after decimal
						str = str.substring(0, (str.length - 1));
						document.getElementById('betRzText').value = str;
					}
					else{
						const strToNum = parseFloat(str);
						if (strToNum < rangeSlider.min){
							rangeSlider.value = rangeSlider.min;
						}
						else if(strToNum > rangeSlider.max){
							rangeSlider.value = rangeSlider.max;
						}
						else{
							rangeSlider.value = strToNum;
						}

						let sliderValue = parseFloat(rangeSlider.value).toFixed(2);
						if (sliderValue.substring(sliderValue.length - 3, sliderValue.length) == '.00'){
							sliderValue = sliderValue.substring(0, sliderValue.length - 3);
						}
						raiseButton.innerHTML = "Bet " + sliderValue;
					}
				}
				else if(lastKey == '.'){
					const decMatch = str.match(/\./g);
					if (decMatch != null){//check to see if there were previous decimal points
						if (decMatch.length > 1){
							str = str.substring(0, (str.length - 1));
							document.getElementById('betRzText').value = str;
						}
					}
				}
				else if(str == ''){
					rangeSlider.value = rangeSlider.min;

					let sliderValue = parseFloat(rangeSlider.value).toFixed(2);
					if (sliderValue.substring(sliderValue.length - 3, sliderValue.length) == '.00'){
						sliderValue = sliderValue.substring(0, sliderValue.length - 3);
					}
					raiseButton.innerHTML = "Bet " + sliderValue;
				}
				else{//letters
					str = str.substring(0, (str.length - 1));
					document.getElementById('betRzText').value = str;
				}			
			}
			document.getElementById('betRzText').addEventListener('input', this.restrictText);
			
			//adds methods to check and bet buttons
			this.betFunction = () => {
				this.bet(parseFloat(rangeSlider.value), cashGameObj, betRoundObj, currentIdx);				
			}
			betButton.addEventListener('click', this.betFunction);	

			this.checkFunction = ()=>{
				this.check(cashGameObj, betRoundObj, currentIdx);
			}
			checkButton.addEventListener('click', this.checkFunction);	
							
			//show check and bet buttons, and rangeSlider
			checkButton.style.display = "flex";
			betButton.style.display = "flex";
			rangeSlider.style.display = "flex";
			textBox.style.display = "flex";
		}		
		else{//facing bet or raise in front so call, raise(not always), and fold buttons shown			

			//sets callAmount
			let callAmount = parseFloat((parseFloat(parseFloat(cashGameObj.betAmounts[0]).toFixed(2)) - parseFloat(parseFloat(this.previousBet)).toFixed(2)));
			if(this.stack <= callAmount){
				callAmount = parseFloat(parseFloat(this.stack).toFixed(2));
			}

			//adds callAmount to callButton text and shows correct buttons since it can be BB's option preflop
			if(callAmount == 0){
				checkButton.style.display = "flex";
			}
			else{
				callButton.style.display = "flex";
				foldButton.style.display = "flex";
				let printedCallAmount = callAmount.toFixed(2);
				if (printedCallAmount.substring(printedCallAmount.length - 3, printedCallAmount.length) == '.00'){
					printedCallAmount = printedCallAmount.substring(0, printedCallAmount.length - 3);
				}

				//postflop previous bet is 0
				callButton.innerHTML = "Call " + printedCallAmount;
			}

			//adds methods to checkButton, callButton, and foldButton
			this.checkFunction = () => {
				this.check(cashGameObj, betRoundObj, currentIdx);
			}
			checkButton.addEventListener('click', this.checkFunction);	

			this.callFunction = () => {
				this.call(cashGameObj, betRoundObj, currentIdx);
			}
			callButton.addEventListener('click', this.callFunction);

			this.foldFunction = () => {
				this.fold(cashGameObj, betRoundObj, currentIdx);
			}
			foldButton.addEventListener('click', this.foldFunction); 

			//make legalRaise true when posting blinds in call method
			const raiseMax = parseFloat(this.stack) + parseFloat(this.previousBet);
			if((raiseMax > cashGameObj.betAmounts[0]) && (cashGameObj.legalRaise) && (cashGameObj.playersInPot.length > 1)){//raiseBtn and slider shown since conditions are met
					
				//sets raise rangeSlider's min, max, and defaultValue 
				const minRaise = parseFloat(cashGameObj.betAmounts[0]) + parseFloat(cashGameObj.betDifference);
				if(raiseMax < minRaise){//stack less than minRaise
					rangeSlider.min = raiseMax;
				}
				else{//stack equal or greater than minRaise			
					rangeSlider.min = minRaise;
				}
				rangeSlider.max = parseFloat(this.stack) + parseFloat(this.previousBet);
				rangeSlider.value = rangeSlider.min;		

				//adds rangeSlider value to raiseButton text
				let sliderDefault = parseFloat(rangeSlider.value).toFixed(2);
				if (sliderDefault.substring(sliderDefault.length - 3, sliderDefault.length) == '.00'){
					sliderDefault = sliderDefault.substring(0, sliderDefault.length - 3);
				}
				raiseButton.innerHTML = "Raise " + sliderDefault;	

				this.rangeFunction = () => {//raiseBtn txt changes when you move slider
					let sliderValue = parseFloat(rangeSlider.value).toFixed(2);
					if (sliderValue.substring(sliderValue.length - 3, sliderValue.length) == '.00'){
						sliderValue = sliderValue.substring(0, sliderValue.length - 3);
					}
					raiseButton.innerHTML = "Raise " + sliderValue;					
				}
				rangeSlider.addEventListener('input', this.rangeFunction); 

				this.restrictText = (evt) =>{
					let str = document.getElementById('betRzText').value;
					const lastKey = str[str.length - 1];
  
					if((lastKey >= '0')&&(lastKey <= '9')){
						if(str.match(/\.\d{3,}$/) != null){//check to see if 2 digits after decimal
							str = str.substring(0, (str.length - 1));
							document.getElementById('betRzText').value = str;
						}
						else{
							const strToNum = parseFloat(str);
							if (strToNum < rangeSlider.min){
								rangeSlider.value = rangeSlider.min;
							}
							else if(strToNum > rangeSlider.max){
								rangeSlider.value = rangeSlider.max;
							}
							else{
								rangeSlider.value = strToNum;
							}

							let sliderValue = parseFloat(rangeSlider.value).toFixed(2);
							if (sliderValue.substring(sliderValue.length - 3, sliderValue.length) == '.00'){
								sliderValue = sliderValue.substring(0, sliderValue.length - 3);
							}
							raiseButton.innerHTML = "Raise " + sliderValue;
						}
					}
					else if(lastKey == '.'){
						const decMatch = str.match(/\./g);
						if (decMatch != null){//check to see if there were previous decimal points
							if (decMatch.length > 1){
								str = str.substring(0, (str.length - 1));
								document.getElementById('betRzText').value = str;
							}
						}
					}
					else if(str == ''){
						rangeSlider.value = rangeSlider.min;

						let sliderValue = parseFloat(rangeSlider.value).toFixed(2);
						if (sliderValue.substring(sliderValue.length - 3, sliderValue.length) == '.00'){
							sliderValue = sliderValue.substring(0, sliderValue.length - 3);
						}
						raiseButton.innerHTML = "Raise " + sliderValue;
					}
					else{//letters
						str = str.substring(0, (str.length - 1));
						document.getElementById('betRzText').value = str;
					}			
				}
				document.getElementById('betRzText').addEventListener('input', this.restrictText);

				//adds method to raiseButton
				this.raiseFunction = () => {
					this.raise(parseFloat(rangeSlider.value), cashGameObj, betRoundObj, currentIdx);
				}
				raiseButton.addEventListener('click', this.raiseFunction);

				//show raise Button and slider
				raiseButton.style.display = "flex";
				textBox.style.display = "flex";	
				rangeSlider.style.display = "flex";
			}					
		}
	}
	bet(rangeVal, cashGameObj, betRoundObj, currentIdx){ 

		//glitch error will redirect to this.action
		if (parseFloat(parseFloat(rangeVal).toFixed(2)) > parseFloat(parseFloat(this.stack).toFixed(2))){
			this.action(cashGameObj);
		}
		else if ((parseFloat(parseFloat(this.stack).toFixed(2)) < parseFloat(parseFloat(cashGameObj.blinds[1]).toFixed(2))) && (parseFloat(parseFloat(rangeVal).toFixed(2)) < parseFloat(parseFloat(this.stack)).toFixed(2))){//stack less than min bet but betAmount glitches to be less than all in
			this.action(cashGameObj);
		}
		else{//no glitch				

			document.getElementById('betRzText').value = '';
			//sets cashGameObj's betAmount and legalRaise, and player's previousBet
			rangeVal = parseFloat(parseFloat(Math.round((parseFloat(rangeVal) + Number.EPSILON) * 100) / 100).toFixed(2));
			cashGameObj.betAmounts = [rangeVal];	
			cashGameObj.legalRaise = true;			

			//sets betDifference if all in is less than 1 BB or equal to and more than in cashGameObj
			if (rangeVal < cashGameObj.blinds[1]){//bet less than 1 BB
				cashGameObj.betDifference = blinds[1];
			}
			else{//bet at least 1 BB
				cashGameObj.betDifference = rangeVal;
			}
		
			//bet circles table around to bettor - 1
			cashGameObj.updateLastToAct(this.seat - 1);

			if (parseFloat(rangeVal).toFixed(2) == parseFloat(this.stack).toFixed(2)){//all in bet
				cashGameObj.tempPots[0].setAllIn(this.stack, (this.seat - 1));
				const newBetAllIn = new betAllInAmt(this.stack, true);
				newBetAllIn.addAllIn((this.seat - 1));
				cashGameObj.betAllInAmts.unshift(newBetAllIn);
				
				this.stack = 0;
				this.previousBet = 0;

				let printedStack = 0;

				document.getElementById('chipStack'+ this.seat.toString() + 'p').textContent = "$" + printedStack;    

				cashGameObj.allInCounter = cashGameObj.allInCounter + 1;

				displayArrChips(rangeVal, cashGameObj.betAmounts, this.seat, cashGameObj.table.length);
				betTextOutput(cashGameObj.betAmounts[0], cashGameObj.table.length, (this.seat - 1));
								
				//add to outermost Pot
				cashGameObj.addToOutermostPot(rangeVal);

				betRoundObj.afterFirstIteration = true;

				clearTimeout(this.regTimer);
				clearInterval(this.countdown);

				//removes event listeners 
				document.getElementById("callBtn").removeEventListener('click', this.callFunction);	
				document.getElementById("chkBtn").removeEventListener('click', this.checkFunction);	
				document.getElementById("rzBtn").removeEventListener('click', this.raiseFunction);	
				document.getElementById("foldBtn").removeEventListener('click', this.foldFunction);		
				document.getElementById("betBtn").removeEventListener('click', this.betFunction);	
				document.getElementById("betRaiseRange").removeEventListener('input', this.rangeFunction);					

				this.removePlayerInPot(cashGameObj, betRoundObj, currentIdx);
				//maybe create method for player for above instead of cashGameObj so that you can run roundLoop
					//if more action to go instead of rewarding pot imm. or no more betting
			}
			else{//non all in bet
				cashGameObj.tempPots[0].changeBetAmt(rangeVal);
				cashGameObj.betAllInAmts.unshift(new betAllInAmt(rangeVal));
				
				this.stack = Math.round((parseFloat(this.stack - rangeVal) + Number.EPSILON) * 100) / 100;
				this.previousBet = rangeVal;
				let printedStack = parseFloat(this.stack).toFixed(2);
				if (printedStack.substring(printedStack.length - 3, printedStack.length) == '.00'){
					printedStack = printedStack.substring(0, printedStack.length - 3);
				}
				document.getElementById('chipStack'+ this.seat.toString() + 'p').textContent = "$" + printedStack;    		
				
				displayArrChips(rangeVal, cashGameObj.betAmounts, this.seat, cashGameObj.table.length);
				betTextOutput(cashGameObj.betAmounts[0], cashGameObj.table.length, (this.seat - 1));
								
				//add to outermost Pot
				cashGameObj.addToOutermostPot(rangeVal);

				betRoundObj.afterFirstIteration = true;

				clearTimeout(this.regTimer);
				clearInterval(this.countdown);

				//remove event listeners
				document.getElementById("callBtn").removeEventListener('click', this.callFunction);	
				document.getElementById("chkBtn").removeEventListener('click', this.checkFunction);	
				document.getElementById("rzBtn").removeEventListener('click', this.raiseFunction);	
				document.getElementById("foldBtn").removeEventListener('click', this.foldFunction);		
				document.getElementById("betBtn").removeEventListener('click', this.betFunction);	
				document.getElementById("betRaiseRange").removeEventListener('input', this.rangeFunction);	

				betRoundObj.roundLoop(cashGameObj, currentIdx, (this.seat - 1));
			}		

			document.getElementById('timer').textContent = "Timer: 30";
			const seatCircle = document.getElementById('seat'+ (this.seat) + 'Div').getElementsByClassName("divCircles")[0]; 
			seatCircle.style.borderColor = "rgb(128, 128, 128)";						
			
			/*
			document.getElementById("chkBtn").style.display = "none";
			document.getElementById("betBtn").style.display = "none";
			document.getElementById("betRaiseRange").style.display = "none";
			*/
		}
	}
	raise(rangeVal, cashGameObj, betRoundObj, currentIdx){
		rangeVal = parseFloat(parseFloat(Math.round((parseFloat(rangeVal) + Number.EPSILON) * 100) / 100).toFixed(2));
		const amtToDeduct = parseFloat(parseFloat(Math.round((parseFloat(rangeVal - this.previousBet) + Number.EPSILON) * 100) / 100).toFixed(2));
		
		//glitches and else is no glitch
		if ((parseFloat(rangeVal.toFixed(2))) > parseFloat((this.stack + this.previousBet).toFixed(2))){
			this.action(cashGameObj);
		}//raise greater than remaining stack + stack's previous bet 
		else if(!cashGameObj.legalRaise){//can't raise, but raise button glitch and showed
			this.action(cashGameObj);
		}
		else{//no glitch

			document.getElementById('betRzText').value = '';

			// sets boolean value of legalRaise
			if (rangeVal >= parseFloat(parseFloat(cashGameObj.betAmounts[0] + (.5 * cashGameObj.betDifference)).toFixed(2))){//legal
				cashGameObj.legalRaise = true;
			} 
			else{//not legal
				cashGameObj.legalRaise = false;
			}

			//sets betDifference, betAmount and adds seatNum to actionCallArr
			cashGameObj.betDifference = parseFloat(parseFloat(rangeVal - cashGameObj.betAmounts[0]).toFixed(2));
			cashGameObj.betAmounts.unshift(rangeVal);	
			
			if (parseFloat(amtToDeduct).toFixed(2) == parseFloat(this.stack).toFixed(2)){//all in raise

				const allInAmt = parseFloat(parseFloat(this.stack + this.previousBet).toFixed(2));
				const allInRz = new betAllInAmt(allInAmt, true);

				this.deductPreviousBet(cashGameObj);
				allInRz.setOverallCount(cashGameObj);
				allInRz.updateLowerAllIns(cashGameObj);
				allInRz.addAllIn((this.seat - 1));

				cashGameObj.betAllInAmts.unshift(allInRz);

				//either creates new pot or set existing corresponding pot all in while pushing in seat
				if(cashGameObj.extraPot){
					cashGameObj.tempPots.unshift(new Pot(allInAmt, true));
					cashGameObj.tempPots[0].addAllIn((this.seat - 1));
				}
				else{
					cashGameObj.tempPots[0].setAllIn(allInAmt, (this.seat - 1));
				}
				cashGameObj.extraPot = true;
								
				this.stack = 0;
				this.previousBet = 0;
				let printedStack = 0;
				document.getElementById('chipStack'+ this.seat.toString() + 'p').textContent = "$" + printedStack;
				
				cashGameObj.allInCounter = cashGameObj.allInCounter + 1;
				
				displayArrChips(rangeVal, cashGameObj.betAmounts, this.seat, cashGameObj.table.length); //check to see if previousBet small blind
				betTextOutput(cashGameObj.betAmounts[0], cashGameObj.table.length, (this.seat - 1));

				cashGameObj.calculatePots();

				//raise circles table around to raiser - 1	(make sure inPotCounter is same before raiser was spliced)
				cashGameObj.updateLastToAct(this.seat - 1);
				
				betRoundObj.afterFirstIteration = true;

				clearTimeout(this.regTimer);
				clearInterval(this.countdown);

				//remove event listeners
				document.getElementById("callBtn").removeEventListener('click', this.callFunction);	
				document.getElementById("chkBtn").removeEventListener('click', this.checkFunction);	
				document.getElementById("rzBtn").removeEventListener('click', this.raiseFunction);	
				document.getElementById("foldBtn").removeEventListener('click', this.foldFunction);		
				document.getElementById("betBtn").removeEventListener('click', this.betFunction);	
				document.getElementById("betRaiseRange").removeEventListener('input', this.rangeFunction);	

				//splice seatNum from playersInPot since player is all In. come back here later
				this.removePlayerInPot(cashGameObj, betRoundObj, currentIdx);
			}
			else{//non all in raise

				const nonAllInRz = new betAllInAmt(rangeVal);
				nonAllInRz.setOverallCount(cashGameObj);
				nonAllInRz.updateLowerAllIns(cashGameObj);
				cashGameObj.betAllInAmts.unshift(nonAllInRz);
				this.deductPreviousBet(cashGameObj);

				if(cashGameObj.extraPot){
					cashGameObj.tempPots.unshift(new Pot(rangeVal));
				}
				else{
					cashGameObj.tempPots[0].changeBetAmt(rangeVal);
				}
				cashGameObj.extraPot = false;

				this.stack = parseFloat(parseFloat(Math.round((parseFloat(this.stack - amtToDeduct) + Number.EPSILON) * 100) / 100).toFixed(2));
				this.previousBet = rangeVal;
				let printedStack = parseFloat(this.stack).toFixed(2);
				if (printedStack.substring(printedStack.length - 3, printedStack.length) == '.00'){
					printedStack = printedStack.substring(0, printedStack.length - 3);
				}
				document.getElementById('chipStack'+ this.seat.toString() + 'p').textContent = "$" + printedStack;    
				
				displayArrChips(rangeVal, cashGameObj.betAmounts, this.seat, cashGameObj.table.length);//check to see if previousBet small blind, also check previous bets not from player but from game
				betTextOutput(cashGameObj.betAmounts[0], cashGameObj.table.length, (this.seat - 1));

				cashGameObj.calculatePots();

				//raise circles table around to raiser - 1	(make sure inPotCounter is same before raiser was spliced)
				cashGameObj.updateLastToAct(this.seat - 1);

				this.previousBet = rangeVal;	

				//remove event listeners
				document.getElementById("callBtn").removeEventListener('click', this.callFunction);	
				document.getElementById("chkBtn").removeEventListener('click', this.checkFunction);	
				document.getElementById("rzBtn").removeEventListener('click', this.raiseFunction);	
				document.getElementById("foldBtn").removeEventListener('click', this.foldFunction);		
				document.getElementById("betBtn").removeEventListener('click', this.betFunction);	
				document.getElementById("betRaiseRange").removeEventListener('input', this.rangeFunction);	

				clearTimeout(this.regTimer);
				clearInterval(this.countdown);
				
				betRoundObj.roundLoop(cashGameObj, currentIdx, (this.seat - 1));
			}							
			
			document.getElementById('timer').textContent = "Timer: 30";
			const seatCircle = document.getElementById('seat'+ (this.seat) + 'Div').getElementsByClassName("divCircles")[0]; 
			seatCircle.style.borderColor = "rgb(128, 128, 128)";						
			

			/*
			document.getElementById("callBtn").style.display = "none";	
			document.getElementById("foldBtn").style.display = "none";
			document.getElementById("rzBtn").style.display = "none";
			document.getElementById("betRaiseRange").style.display = "none";
			*/
		}
	}
	check(cashGameObj, betRoundObj, currentIdx){			
		document.getElementById('betRzText').value = '';

		const actionParent = document.getElementById('action'+ this.seat + 'Div');
		actionParent.style.display = "flex";

		const actionDiv = document.getElementById('action'+ this.seat + 'Text');
		actionDiv.textContent = '';
		actionDiv.style.display = "inline-block";
		actionDiv.style.position = "absolute";

		actionDiv.appendChild(document.createTextNode('Check'));

		const idxSetCoordinates = idxOfCoordinates(cashGameObj.table.length);
		const seatIdx = this.seat - 1;
		actionDiv.style.left = bestActionOutput(idxSetCoordinates, seatIdx, actionDiv.offsetWidth);
		actionDiv.style.top = bestActionsAllSizes[idxSetCoordinates][seatIdx][1];  

		betRoundObj.afterFirstIteration = true;

		clearTimeout(this.regTimer);
		clearInterval(this.countdown);

		//remove event listeners
		document.getElementById("callBtn").removeEventListener('click', this.callFunction);	
		document.getElementById("chkBtn").removeEventListener('click', this.checkFunction);	
		document.getElementById("rzBtn").removeEventListener('click', this.raiseFunction);	
		document.getElementById("foldBtn").removeEventListener('click', this.foldFunction);		
		document.getElementById("betBtn").removeEventListener('click', this.betFunction);	
		document.getElementById("betRaiseRange").removeEventListener('input', this.rangeFunction);	

		document.getElementById('timer').textContent = "Timer: 30";
		const seatCircle = document.getElementById('seat'+ (this.seat) + 'Div').getElementsByClassName("divCircles")[0]; 
		seatCircle.style.borderColor = "rgb(128, 128, 128)";						
		

		betRoundObj.roundLoop(cashGameObj, currentIdx, (this.seat - 1));
		/*
		document.getElementById("chkBtn").style.display = "none";
		document.getElementById("betBtn").style.display = "none";
		document.getElementById("betRaiseRange").style.display = "none";
		*/
	}	
	fold(cashGameObj, betRoundObj, currentIdx){
		document.getElementById('betRzText').value = '';

		const actionParent = document.getElementById('action'+ this.seat + 'Div');
		actionParent.style.display = "flex";

		const actionDiv = document.getElementById('action'+ this.seat + 'Text');
		actionDiv.textContent = '';
		actionDiv.style.display = "inline-block";
		actionDiv.style.position = "absolute";

		actionDiv.appendChild(document.createTextNode('Fold'));

		const idxSetCoordinates = idxOfCoordinates(cashGameObj.table.length);
		const seatIdx = this.seat - 1;
		actionDiv.style.left = bestActionOutput(idxSetCoordinates, seatIdx, actionDiv.offsetWidth);
		actionDiv.style.top = bestActionsAllSizes[idxSetCoordinates][seatIdx][1];  

		betRoundObj.afterFirstIteration = true;
		
		//clear up hole cards
		this.hand = [];

		clearTimeout(this.regTimer);
		clearInterval(this.countdown);

		//remove event listeners
		document.getElementById("callBtn").removeEventListener('click', this.callFunction);	
		document.getElementById("chkBtn").removeEventListener('click', this.checkFunction);	
		document.getElementById("rzBtn").removeEventListener('click', this.raiseFunction);	
		document.getElementById("foldBtn").removeEventListener('click', this.foldFunction);		
		document.getElementById("betBtn").removeEventListener('click', this.betFunction);	
		document.getElementById("betRaiseRange").removeEventListener('input', this.rangeFunction);	

		document.getElementById('timer').textContent = "Timer: 30";
		const seatCircle = document.getElementById('seat'+ (this.seat) + 'Div').getElementsByClassName("divCircles")[0]; 
		seatCircle.style.borderColor = "rgb(128, 128, 128)";						
		

		this.removePlayerInPot(cashGameObj, betRoundObj, currentIdx);

		/*
		const currentHoleCardDiv = document.getElementById('holeCards' + this.seat.toString() + 'div');
		currentHoleCardDiv.removeChild(currentHoleCardDiv.childNodes[0]);
		currentHoleCardDiv.removeChild(currentHoleCardDiv.childNodes[0]);
		*/
		/*
		document.getElementById("callBtn").style.display = "none";	
		document.getElementById("foldBtn").style.display = "none";
		document.getElementById("rzBtn").style.display = "none";
		document.getElementById("betRaiseRange").style.display = "none";
		*/
	}
	findCreateAmtNPot(cashGameObj, betAmt, allInBool = false){//only used in callNoBetRound		
		//check to see if betAllInAmt exists
		const betAllInObj = cashGameObj.betAllInAmts.find(betAllInAmt => betAllInAmt.betAmount == betAmt);

		//check below for scenario when LESSER AMT IS JUST A PREVIOUS NONALL IN BET. WONT BE POT AMOUNT SINCE IT'S LESSER NONALL IN BET
		if (betAllInObj == undefined){//betAmtObj doesn't exist

			//create new betAllInAmt for amount 
			const newBetAllIn = new betAllInAmt(betAmt, allInBool);
			if (allInBool){
				newBetAllIn.addAllIn((this.seat - 1));
			}
			cashGameObj.betAllInAmts.push(newBetAllIn);
			cashGameObj.sortBetAmts();
			
			newBetAllIn.setOverallCount(cashGameObj);
			newBetAllIn.updateLowerAllIns(cashGameObj);

			if(allInBool){//if amount for less, then that lower amount is all in and since all in and betAllInObj doesn't exist we create new pot
				if ((cashGameObj.tempPots.length == 1) && (!cashGameObj.tempPots[0].allInBool) && (cashGameObj.tempPots[0].betAmount < betAmt)){//take sb into account, but not everything to account
					cashGameObj.tempPots[0].setAllIn(betAmt, (this.seat - 1));
				}
				else{					
					const newPot = new Pot(betAmt, true);
					newPot.addAllIn((this.seat - 1));
					cashGameObj.tempPots.push(newPot); 				
					cashGameObj.sortPots();
				}
			}
			else{
				if(cashGameObj.tempPots.length == 0){//only when you call callNoBetRound with SB
					const newPot = new Pot(betAmt);					
					cashGameObj.tempPots.push(newPot); 	
				}
				else{					
					cashGameObj.tempPots[0].changeBetAmt(betAmt);					
				}
			}
			cashGameObj.calculatePots();
		}
		else{//betAllInObj exists already

			//below won't work unless last betAmount or betAmout is all in call
			const betAllInPot = cashGameObj.tempPots.find(pot => pot.betAmount == betAmt);	

			if(allInBool){
				betAllInObj.setAllIn(cashGameObj);
				betAllInObj.addAllIn((this.seat - 1));

				if(betAllInPot != undefined){//pot exists
					betAllInPot.setAllIn(betAmt, (this.seat - 1)); 
				}
				else{//pot doesn't exist
					const newPot = new Pot(betAmt, true);
					newPot.addAllIn((this.seat - 1));
					
					cashGameObj.tempPots.push(newPot); 			
					cashGameObj.sortPots();										
				}
			}
			else{
				betAllInObj.updateCount(cashGameObj);

				if (betAllInPot == undefined){//no match for pot of same amount
					cashGameObj.tempPots[0].changeBetAmt(betAmt); //since not all in, no amount greater than betAmt
				}
			}
			cashGameObj.calculatePots();
		}
	}
	deductPreviousBet(cashGameObj){
		if (this.previousBet != 0){
			const betAllInObj = cashGameObj.betAllInAmts.find(betAllInAmt => betAllInAmt.betAmount == this.previousBet);
			betAllInObj.deductFromCount(cashGameObj);
		}
	}
	call(cashGameObj, betRoundObj, currentIdx){	
		document.getElementById('betRzText').value = '';

		const stackStartRound = parseFloat((parseFloat(parseFloat(this.stack).toFixed(2)) + (parseFloat(parseFloat(this.previousBet).toFixed(2)))).toFixed(2));

		if (stackStartRound <= cashGameObj.betAmounts[0]){
			clearTimeout(this.regTimer);
			clearInterval(this.countdown);
			this.callNoBetRound(cashGameObj);

			displayArrChips(stackStartRound, cashGameObj.betAmounts, this.seat, cashGameObj.table.length);
			betTextOutput(stackStartRound, cashGameObj.table.length, (this.seat - 1));
		}
		else{			
			clearTimeout(this.regTimer);
			clearInterval(this.countdown);
			this.callNoBetRound(cashGameObj);

			displayArrChips(cashGameObj.betAmounts[0], cashGameObj.betAmounts, this.seat, cashGameObj.table.length);
			betTextOutput(cashGameObj.betAmounts[0], cashGameObj.table.length, (this.seat - 1));
		}
				
		document.getElementById('timer').textContent = "Timer: 30";
		const seatCircle = document.getElementById('seat'+ (this.seat) + 'Div').getElementsByClassName("divCircles")[0]; 
		seatCircle.style.borderColor = "rgb(128, 128, 128)";						
		

		if(this.stack == 0){
			betRoundObj.afterFirstIteration = true;

			//remove event listeners
			document.getElementById("callBtn").removeEventListener('click', this.callFunction);	
			document.getElementById("chkBtn").removeEventListener('click', this.checkFunction);	
			document.getElementById("rzBtn").removeEventListener('click', this.raiseFunction);	
			document.getElementById("foldBtn").removeEventListener('click', this.foldFunction);		
			document.getElementById("betBtn").removeEventListener('click', this.betFunction);	
			document.getElementById("betRaiseRange").removeEventListener('input', this.rangeFunction);	

			this.removePlayerInPot(cashGameObj, betRoundObj, currentIdx);
		}
		else{
			betRoundObj.afterFirstIteration = true;

			//remove event listeners
			document.getElementById("callBtn").removeEventListener('click', this.callFunction);	
			document.getElementById("chkBtn").removeEventListener('click', this.checkFunction);	
			document.getElementById("rzBtn").removeEventListener('click', this.raiseFunction);	
			document.getElementById("foldBtn").removeEventListener('click', this.foldFunction);		
			document.getElementById("betBtn").removeEventListener('click', this.betFunction);	
			document.getElementById("betRaiseRange").removeEventListener('input', this.rangeFunction);	

			betRoundObj.roundLoop(cashGameObj, currentIdx, (this.seat - 1));
		}

		/*
		document.getElementById("callBtn").style.display = "none";	
		document.getElementById("foldBtn").style.display = "none";
		document.getElementById("rzBtn").style.display = "none";
		document.getElementById("betRaiseRange").style.display = "none";
		*/
	}
	callNoBetRound(cashGameObj){//take previousBet into account like when sb calls, and other scenarios too
		const amtToCall = parseFloat(parseFloat(Math.round((parseFloat(cashGameObj.betAmounts[0] - this.previousBet) + Number.EPSILON) * 100) / 100).toFixed(2));

		//change it so that it's raiseTotal not remaining stack
		if(parseFloat(parseFloat(this.stack).toFixed(2)) < parseFloat(parseFloat(amtToCall).toFixed(2))){
			this.deductPreviousBet(cashGameObj);
			
			this.findCreateAmtNPot(cashGameObj, parseFloat(parseFloat(this.stack + this.previousBet).toFixed(2)), true);	
			
			this.stack = 0;
			this.previousBet = 0;
			let printedStack = parseFloat(this.stack).toFixed(2);
			if (printedStack.substring(printedStack.length - 3, printedStack.length) == '.00'){
				printedStack = printedStack.substring(0, printedStack.length - 3);
			}
			document.getElementById('chipStack'+ this.seat.toString() + 'p').textContent = "$" + printedStack;  

			cashGameObj.allInCounter = cashGameObj.allInCounter + 1;
		}		
		else if (parseFloat(parseFloat(this.stack).toFixed(2)) == parseFloat(parseFloat(amtToCall).toFixed(2))){
			
			this.deductPreviousBet(cashGameObj);
						
			this.findCreateAmtNPot(cashGameObj, parseFloat(parseFloat(this.stack + this.previousBet).toFixed(2)), true);	

			cashGameObj.extraPot = true;

			//sets stack to 0 and splices seat from playersInPot
			this.stack = 0;	
			this.previousBet = 0;
			let printedStack = parseFloat(this.stack).toFixed(2);
			if (printedStack.substring(printedStack.length - 3, printedStack.length) == '.00'){
				printedStack = printedStack.substring(0, printedStack.length - 3);
			}
			document.getElementById('chipStack'+ this.seat.toString() + 'p').textContent = "$" + printedStack;    
					
			cashGameObj.allInCounter = cashGameObj.allInCounter + 1;
		}
		else{//player not all in				
			this.deductPreviousBet(cashGameObj);
			this.findCreateAmtNPot(cashGameObj, cashGameObj.betAmounts[0]);

			this.stack = parseFloat(parseFloat(Math.round((parseFloat(this.stack - amtToCall) + Number.EPSILON) * 100) / 100).toFixed(2));
			let printedStack = parseFloat(this.stack).toFixed(2);
			if (printedStack.substring(printedStack.length - 3, printedStack.length) == '.00'){
				printedStack = printedStack.substring(0, printedStack.length - 3);
			}
			document.getElementById('chipStack'+ this.seat.toString() + 'p').textContent = "$" + printedStack;  
			this.previousBet = parseFloat(parseFloat(cashGameObj.betAmounts[0]).toFixed(2)); 	//do this after decrementing from previousBet amount
		}
	}
	removePlayerInPot(cashGameObj, betRoundObj, idxToRemove){//didn't finish getting rid of holecards and its images

		this.removeNoBetRound(cashGameObj, idxToRemove);
		if(cashGameObj.playersInPot.length == 1){//1 player left not all in, check to see if they already acted
			
			//can be players all in, but this checks if last standing player's action is yet to be completed
			if(cashGameObj.allInCounter >= 1){
				if((cashGameObj.playersInPot[0] == cashGameObj.lastToAct)){//player yet to act
					betRoundObj.roundLoop(cashGameObj, (idxToRemove - 1), (this.seat - 1)); //
				}
			}
		}	
        else if (cashGameObj.playersInPot.length >= 2){//at least 2 players standing
            betRoundObj.roundLoop(cashGameObj, (idxToRemove - 1), (this.seat - 1)); //
        }
    }
	removeNoBetRound(cashGameObj, idxToRemove){	
		cashGameObj.playersInPot.splice(idxToRemove, 1);		

		if (cashGameObj.playersInPot.length == 0){//everyone's all in   
            if(cashGameObj.allInCounter == 1){//means only 1 player all in so reward pot to him and start new hand
                const allInIdx = cashGameObj.tempPots[0].allInsIdx[0];
                cashGameObj.table[allInIdx].stack = parseFloat(parseFloat(Math.round((parseFloat(cashGameObj.table[allInIdx].stack + cashGameObj.tempPots[0].total) + Number.EPSILON) * 100) / 100).toFixed(2));
                cashGameObj.clearPreviousBets();
				let printedStack = parseFloat(cashGameObj.table[allInIdx].stack).toFixed(2);
				if (printedStack.substring(printedStack.length - 3, printedStack.length) == '.00'){
					printedStack = printedStack.substring(0, printedStack.length - 3);
				}

				document.getElementById('winnerText').textContent = 'Winner(s): Main Pot: Seat ' + (allInIdx + 1);
				document.getElementById('chipStack'+ (allInIdx + 1) + 'p').textContent = "$" + printedStack; 
				document.getElementById('action').style.display = "none";

				const seatCircle = document.getElementById('seat'+ (allInIdx + 1) + 'Div').getElementsByClassName("divCircles")[0]; 
				seatCircle.style.borderColor = "blue";

				cashGameObj.clearPreviousActions(true);
				cashGameObj.beforeNewHand([]);
            }
            else{//multiple all ins, so showdown with no more betting rounds
                if(cashGameObj.tempPots[0].allInsIdx.length == 1){//somone has everyone covered, so not really all in
                    //give chips back immediately before another card is dealt
                    const notAllInIdx = cashGameObj.tempPots[0].allInsIdx[0];
                    cashGameObj.table[notAllInIdx].stack = parseFloat(parseFloat(Math.round((parseFloat(cashGameObj.table[notAllInIdx].stack + cashGameObj.tempPots[0].total) + Number.EPSILON) * 100) / 100).toFixed(2));					
                    cashGameObj.betAllInAmts.splice(0, 1);
                    cashGameObj.tempPots.splice(0, 1);
                    cashGameObj.playersInPot.push(cashGameObj.table[notAllInIdx].seat - 1);
					let printedStack = parseFloat(cashGameObj.table[notAllInIdx].stack).toFixed(2);
					if (printedStack.substring(printedStack.length - 3, printedStack.length) == '.00'){
						printedStack = printedStack.substring(0, printedStack.length - 3);
					}
					document.getElementById('chipStack'+ (notAllInIdx + 1) + 'p').textContent = "$" + printedStack;    
					
					cashGameObj.allInCounter = cashGameObj.allInCounter - 1;
					cashGameObj.calculatePots();					
                }

                //showdown (not in method below)
				cashGameObj.clearPreviousBets();
				cashGameObj.clearPreviousActions(true);
                cashGameObj.noMoreBetting(); 
            }
        }
        else if(cashGameObj.playersInPot.length == 1){//1 player left not all in, check if anyone's all in
			//can be 1 player all in, but last standing player's action yet to be completed

            if(cashGameObj.allInCounter >= 1){
				if((cashGameObj.playersInPot[0] != cashGameObj.lastToAct)){//remaining player already acted
					cashGameObj.clearPreviousBets();
					cashGameObj.clearPreviousActions(true);
					cashGameObj.noMoreBetting();
				}
            }
            else{//reward only player altogther(allin or not) then start new game
                const onlyLeftIdx = cashGameObj.playersInPot[0];
                cashGameObj.table[onlyLeftIdx].stack = parseFloat(parseFloat(Math.round((parseFloat(cashGameObj.table[onlyLeftIdx].stack + cashGameObj.tempPots[0].total) + Number.EPSILON) * 100) / 100).toFixed(2));
				cashGameObj.clearPreviousBets();
				let printedStack = parseFloat(cashGameObj.table[onlyLeftIdx].stack).toFixed(2);
				if (printedStack.substring(printedStack.length - 3, printedStack.length) == '.00'){
					printedStack = printedStack.substring(0, printedStack.length - 3);
				}
				document.getElementById('winnerText').textContent = 'Winner(s): Main Pot: Seat ' + (onlyLeftIdx + 1);
				document.getElementById('chipStack'+ (onlyLeftIdx + 1) + 'p').textContent = "$" + printedStack;
				document.getElementById('action').style.display = "none";  

				const seatCircle = document.getElementById('seat'+ (onlyLeftIdx + 1) + 'Div').getElementsByClassName("divCircles")[0]; 
                seatCircle.style.borderColor = "blue";

				cashGameObj.clearPreviousActions(true);
				cashGameObj.beforeNewHand([]);
            }
        }
	}
}

module.exports = {
	Player : Player
}