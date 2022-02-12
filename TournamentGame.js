const {Card} = require('./Card.js');
const {Deck} = require('./Deck.js');
const {Player} = require('./Player.js');
const {Game} = require('./Game.js');

class TournamentGame extends Game{

    constructor(tableSize, setOfBlinds, blindDuration){ //pass in via Tournament Object
        super(tableSize);
        this.blinds = setOfBlinds;
        this.blindDuration = blindDuration;        
    }

    addPlayer(PlayerName, seatNum){//button for corresponding seat in cashGame
        this.addPlayer(PlayerName, seatNum);

		if(this.seatsOccupied === 2){
			this.startGame();
		}	
        
    }


}

module.exports = {
	TournamentGame : TournamentGame
}