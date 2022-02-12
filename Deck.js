const {Card} = require('./Card.js');

class Deck {
	
	constructor(){
		this.deck = [];

		const suits = ['h', 's', 'c', 'd'];
		const values = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14]; //2 for 2... 11 for J... 14 for A 

		for (let suit of suits){			
			for (let value of values){
				this.deck.push(new Card (suit, value));
			}
		}
	}

	shuffle(){
		const shuffled_deck = [];
		let counter = 52;
		let idx;
		
		while (counter >= 1){
			idx = Math.floor(Math.random() * counter); //[0,51] starting
			shuffled_deck.push(this.deck[idx]);
			this.deck.splice(idx,1);
			counter--;
		}
		this.deck = shuffled_deck;
	}	
}

module.exports = {
	Deck : Deck
}