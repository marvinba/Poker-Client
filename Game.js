const {Deck} = require('./Deck.js');
const {Player} = require('./Player.js');

class Game {
	//sitOut radio button only in tournaments
			
	constructor(tableSize){//maybe setOfBlinds for tournament?
		this.size = tableSize;				
		this.table = new Array(tableSize);	
		this.seatsOccupied = 0; //in cashGame counts seats actually taken even if some sitting out in case others want to join
		this.activePlayerCounter = 0; //deal hand iterating through table Array and check if sittingOut in tournament or both?
	}
	
	addPlayer(PlayerName, seatNum){//button for corresponding seat in cashGame
		this.table[seatNum - 1] = PlayerName; 	
		this.seatsOccupied = this.seatsOccupied + 1;	

		
	}

	removePlayer(seatNum){		//can apply to tournaments as well when player is eliminated
		delete this.table[seatNum-1];
		this.seatsOccupied = this.seatsOccupied - 1;
		this.activePlayerCounter = this.activePlayerCounter - 1;
		
		if(this.activePlayerCounter < 2){//active players for cash game, but seatsOccupied for tournament (if 1, then winner declared for tournament)
			this.endGame();
		}	
		
	}
	
	sittingOut(){//radio button (player property for tournament so you automatically fold even when dealt)

	}
	
	sitIn(){//deselect radio button
	}
	
		
	startGame(){//represents dealing a hand
		this.board = [];
		this.mainPot = 0;
		//update button
		//make sure to select new button when new table opens
		
		if(this.seatsOccupiedCounter >= 2){//maybe exclude this conditional later on?
			let deck1 = new Deck ();	
			deck1.shuffle();
			
			//choose button first from seats that are occupied! (only once for cash and tournament for a given table, will last until that table breaks)
			let button = this.randomize(this.seatsOccupied)[0];//maybe this.button?
			
			
			for (let i = 0; i < this.table.length; i++){//what if empty seat in it's corresponding idx? 
				this.table[i].hand.push(deck1.pop());
			} 
		}	
	}
	
	endGame(){
		
	}

	randomize(seatsArray){
		let randomizedSeats = [];
		let tempArray = seatsArray.concat();
		let counter = seatsArray.length;
		let idx;
		
		while (counter >= 1){
			idx = Math.floor(Math.random() * counter); 
			randomizedSeats.push(tempArray[idx]);
			tempArray.splice(idx, 1); 
			counter--;
		}
		return randomizedSeats;
	}
	
	clearTable(){
		
	}
	
	
	
	
	
	

}

module.exports = {
	Game : Game
}