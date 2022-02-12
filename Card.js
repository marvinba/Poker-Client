class Card {
	constructor(suit,value){
		this.suit = suit;
		this.value = value;
	}
	setImg(){
		this.img  = new Image();
		this.img.src = "Images/Hole Cards/Playing Cards/PNG-cards-1.3/" + value.toString() + suit.toString() + ".png"; //pull img from directory and assign it;
	}
}

module.exports = {
	Card : Card
}

