function descendingOrder(hand){
	let outputHand = hand.concat().sort(function(a, b){return b.value - a.value});	
	return outputHand;
}

function straightFlushCheck(hand, typeAndValue, justCheckBoolean = false){
	if(typeAndValue[0] !== ''){//hand type and value already known from previous run of winningHand
		return typeAndValue;
	}

	typeAndValue = flush_check(hand);		

	if (typeAndValue[0] === 'flush'){//a flush or straight flush
		return straight_array(hand, typeAndValue, justCheckBoolean);
	}
	else{//not a flush or straight flush
		if(justCheckBoolean){
			return quadsCheck(hand, typeAndValue, true);
		}
		return typeAndValue; //['', [0,0]]
	}
}
function straightFlushRule(hand1, hand2, typeAndValue_1, typeAndValue_2){
	typeAndValue_1 = straightFlushCheck(hand1, typeAndValue_1);
	typeAndValue_2 = straightFlushCheck(hand2, typeAndValue_2);

	if ((typeAndValue_1[0] === 'straight flush') && (typeAndValue_2[0] === 'straight flush')){//both straight flushes		
		if(typeAndValue_1[1][0] > typeAndValue_2[1][0]){//hand 1 higher straight flush
			return [hand1, typeAndValue_1];
		}
		else if(typeAndValue_1[1][0] < typeAndValue_2[1][0]){//hand 2 higher straight flush
			return [hand2, typeAndValue_2];
		}
		else{//chopping
			return [hand1, typeAndValue_1];
		}		
	}
	else if((!(typeAndValue_1[0] === 'straight flush')) && (typeAndValue_2[0] === 'straight flush')){//hand 2 straight flush, hand 1 not
		return [hand2, typeAndValue_2];
	}
	else if((typeAndValue_1[0] === 'straight flush') && (!(typeAndValue_2[0] === 'straight flush'))){////hand 1 straight flush, hand 2 not
		return [hand1, typeAndValue_1];
	}
	else{//neither straight flushes	
		return quadsRule(hand1, hand2, typeAndValue_1, typeAndValue_2);
	}
}

function quadsCheck(hand, typeAndValue, justCheckBoolean = false){
	
	if (typeAndValue[0] !== ''){//flush or quads or other DEFINITIVE known value and type below quads
		return typeAndValue;
	}

	let sorted_hand = descendingOrder(hand);
	
	let idx = 0;	
	while(idx < 2){//only checks for consecutive pairs, trips, quads from idx 0 and 1

		if(sorted_hand[idx].value === sorted_hand[idx+1].value){//so far pair

			if(sorted_hand[idx+1].value === sorted_hand[idx+2].value){//so far trips 

				if(sorted_hand[idx+2].value === sorted_hand[idx+3].value){//quads
					return ['four of a kind', [sorted_hand[idx].value, -1]];
				}
				else{//either trips or potential full house
					if((idx === 0)){
						if(justCheckBoolean){
							typeAndValue = ['fullHouseOrTrips', [sorted_hand[idx].value, 0]];
							return fullHouseCheck(hand, typeAndValue, true);
						}
	
						return ['fullHouseOrTrips', [sorted_hand[idx].value, 0]];
					}
					else{//idx = 1
						return ['three of a kind', [sorted_hand[idx].value, -1]];
					}
				}
			}
			else{//just pair so far
				if(idx === 0){
					if(justCheckBoolean){
						typeAndValue = ['fullHouseOrTwoPairOrPair', [0, sorted_hand[idx].value]];
						return fullHouseCheck(hand, typeAndValue, true);
					}
					return ['fullHouseOrTwoPairOrPair', [0, sorted_hand[idx].value]];
				}
				else{//idx = 1
					if(justCheckBoolean){
						typeAndValue = ['twoPairOrPair', [sorted_hand[idx].value, 0]];
						return doubles_array(hand, typeAndValue, true, true);
					}
					return ['twoPairOrPair', [sorted_hand[idx].value, 0]];
				}
			}
		}
		else{//no pair yet
			if (idx === 0){
				idx++; 
			}
			else{//at idx 1 and not 1 quadCheck part is true
				if(justCheckBoolean){
					typeAndValue = ['straightOrTripsOrPairOrHighCard', [0, -1]];
					return straight_array(hand, typeAndValue, true);
				}
				
				return ['straightOrTripsOrPairOrHighCard', [0, -1]];
			}			
		}		
	}
}
function quadsRule(hand1, hand2, typeAndValue_1, typeAndValue_2){	
	typeAndValue_1 = quadsCheck(hand1, typeAndValue_1);	
	typeAndValue_2 = quadsCheck(hand2, typeAndValue_2);

	if((typeAndValue_1[0] === 'four of a kind')  && (typeAndValue_2[0] === 'four of a kind')){//both quads
		if(typeAndValue_1[1][0] > typeAndValue_2[1][0]){
			return [hand1, typeAndValue_1];
		}
		else if(typeAndValue_1[1][0] < typeAndValue_2[1][0]){
			return [hand2, typeAndValue_2];
		}
		else{
			return singlesRule(hand1, hand2, typeAndValue_1);
		}
	}
	else if((typeAndValue_1[0] === 'four of a kind') && (!(typeAndValue_2[0] === 'four of a kind'))){//hand 1 quads, hand 2 not 
		return [hand1, typeAndValue_1];
	}
	else if((!(typeAndValue_1[0] === 'four of a kind')) && (typeAndValue_2[0] === 'four of a kind')){//hand 2 quads, hand 1 not 
		return [hand2, typeAndValue_2];
	}
	else{//neither quads		
		return fullHouseRule(hand1, hand2, typeAndValue_1, typeAndValue_2);
	}
}

function fullHouseCheck(hand, typeAndValue, justCheckBoolean = false){	
	if(typeAndValue[0] === 'fullHouseOrTrips'){
		return doubles_array(hand, typeAndValue, justCheckBoolean);
	}
	else if(typeAndValue[0] === 'fullHouseOrTwoPairOrPair'){
		return triple_array(hand, typeAndValue, justCheckBoolean);	
	}
	else{//justCheckBoolean doesn't apply here
		//full house or other known values and DEFINITIVE/potential types below full house
		return typeAndValue;
	}	
}
function fullHouseRule(hand1, hand2, typeAndValue_1, typeAndValue_2){
	typeAndValue_1 = fullHouseCheck(hand1, typeAndValue_1);
	typeAndValue_2 = fullHouseCheck(hand2, typeAndValue_2);	
	
	if ((typeAndValue_1[0] === 'full house') && (typeAndValue_2[0] === 'full house')){//both full houses			
		if (typeAndValue_1[1][0] > typeAndValue_2[1][0]){//hand 1 higher trips in full house than hand 2
			return [hand1, typeAndValue_1];
		}
		else if (typeAndValue_1[1][0] < typeAndValue_2[1][0]){//hand 2 higher trips in full house than hand 1
			return [hand2, typeAndValue_2];
		}
		else{//equal trips in full house
			if (typeAndValue_1[1][1] > typeAndValue_2[1][1]){//hand 1 higher pair in full house than hand 2
				return [hand1, typeAndValue_1];
			}
			else if (typeAndValue_1[1][1] < typeAndValue_2[1][1]){//hand 2 higher pair in full house than hand 1
				return [hand2, typeAndValue_2];
			}
			else{//equal full houses, so chop
				return [hand1, typeAndValue_1];
			}
		}					
	}
	else if((typeAndValue_1[0] === 'full house')  && (!(typeAndValue_2[0] === 'full house'))){//hand 1 full house, but hand2 not
		return [hand1, typeAndValue_1];
	}
	else if((!(typeAndValue_1[0] === 'full house')) && (typeAndValue_2[0] === 'full house')){//hand 2 full house, but hand1 not
		return [hand2, typeAndValue_2];
	}
	else{//neither full house 		
		return flushRule(hand1, hand2, typeAndValue_1, typeAndValue_2);
	}
}

function flush_check(hand){//flush check in straight flush check		
	let suit_arr = [];
	for (let idx = 0; idx < 5; idx++){
		suit_arr.push(hand[idx].suit);
	}
	suit_arr = JSON.stringify(suit_arr);
	const sorted_hand_First = descendingOrder(hand)[0].value;
	if (suit_arr === JSON.stringify(['s','s','s','s','s'])){		
		return ['flush', [sorted_hand_First, -1]];
	}
	else if (suit_arr === JSON.stringify(['d','d','d','d','d'])){
		return ['flush', [sorted_hand_First, -1]];
	}
	else if (suit_arr === JSON.stringify(['h','h','h','h','h'])){
		return ['flush', [sorted_hand_First, -1]];
	}
	else if (suit_arr === JSON.stringify(['c','c','c','c','c'])){
		return ['flush', [sorted_hand_First, -1]];
	}
	else{
		return ['', [0,0]];
	}	
}
function flushRule(hand1, hand2, typeAndValue_1, typeAndValue_2){

	if ((typeAndValue_1[0] === 'flush') && (typeAndValue_2[0] === 'flush')){//both flushes	
		return singlesRule(hand1, hand2, typeAndValue_1);
	}
	else if ((!(typeAndValue_1[0] === 'flush')) && (typeAndValue_2[0] === 'flush')){//hand 2 flush, hand1 not
		return [hand2, typeAndValue_2];			
	}
	else if ((typeAndValue_1[0] === 'flush') && (!(typeAndValue_2[0] === 'flush'))){//hand1 flush, hand2 not			
		return [hand1, typeAndValue_1];
	}
	else{//neither flushes
		return straightRule(hand1, hand2, typeAndValue_1, typeAndValue_2);
	}
}

function straight_array(hand, typeAndValue, justCheckBoolean = false) {		
	let sorted_hand = descendingOrder(hand);
	let extractedSortedHand = JSON.stringify(extractValues(sorted_hand));

	if((typeAndValue[0] === 'flush') || (typeAndValue[0] === 'straightOrTripsOrPairOrHighCard')){
		if (extractedSortedHand === JSON.stringify([14,13,12,11,10])){
			return [straightHandTypeOutput(typeAndValue[0], true), [14,-1]];
		}
		else if(extractedSortedHand === JSON.stringify([14,5,4,3,2])){
			return [straightHandTypeOutput(typeAndValue[0], true), [5,-1]];	
		}
		else if(extractedSortedHand === JSON.stringify([13,12,11,10,9])){
			return [straightHandTypeOutput(typeAndValue[0], true), [13,-1]];
		}
		else if(extractedSortedHand === JSON.stringify([12,11,10,9,8])){
			return [straightHandTypeOutput(typeAndValue[0], true), [12,-1]];
		}
		else if(extractedSortedHand === JSON.stringify([11,10,9,8,7])){
			return [straightHandTypeOutput(typeAndValue[0], true), [11,-1]];
		}
		else if(extractedSortedHand === JSON.stringify([10,9,8,7,6])){
			return [straightHandTypeOutput(typeAndValue[0], true), [10,-1]];
		}
		else if(extractedSortedHand === JSON.stringify([9,8,7,6,5])){
			return [straightHandTypeOutput(typeAndValue[0], true), [9,-1]];
		}
		else if(extractedSortedHand === JSON.stringify([8,7,6,5,4])){
			return [straightHandTypeOutput(typeAndValue[0], true), [8,-1]];
		}
		else if(extractedSortedHand === JSON.stringify([7,6,5,4,3])){
			return [straightHandTypeOutput(typeAndValue[0], true), [7,-1]];	
		}
		else if(extractedSortedHand === JSON.stringify([6,5,4,3,2])){
			return [straightHandTypeOutput(typeAndValue[0], true), [6,-1]];
		}
		else{
			typeAndValue = [straightHandTypeOutput(typeAndValue[0]), typeAndValue[1]];
			
			if (justCheckBoolean){
				if(typeAndValue[0] = 'tripsOrPairOrHighCard'){
					return triple_array(hand, typeAndValue, true);
				}
			}
			return typeAndValue;
		}		
	}
	else{//straight already or other definitive/potential hand types and values below straight (no justCheckBoolean applies here)
		return typeAndValue;
	}	
}
function straightHandTypeOutput(type, straightBoolean = false){
	if (type === 'flush'){
		if(straightBoolean){			
			return 'straight flush';
		}
		else{
			return 'flush'
		}
	}
	else{//type === 'straightOrTripsOrPairOrHighCard'
		if(straightBoolean){
			return 'straight';
		}
		else{
			return 'tripsOrPairOrHighCard';
		}
	}	
}
function extractValues(hand){
	let sorted_hand = descendingOrder(hand);
	let valuesArray = [];

	for(let i = 0; i < sorted_hand.length; i++){
		valuesArray.push(sorted_hand[i].value);
	}
	return valuesArray;
}
function straightRule(hand1, hand2, typeAndValue_1, typeAndValue_2){
	typeAndValue_1 = straight_array(hand1, typeAndValue_1);
	typeAndValue_2 = straight_array(hand2, typeAndValue_2);

	if((typeAndValue_1[0] === 'straight') && (typeAndValue_2[0] === 'straight')){//both are straights 
		if(typeAndValue_1[1][0] > typeAndValue_2[1][0]){
			return [hand1, typeAndValue_1];
		}
		else if(typeAndValue_1[1][0] < typeAndValue_2[1][0]){
			return [hand2, typeAndValue_2];
		}
		else{//chop
			return [hand1, typeAndValue_1];
		}
	}
	else if((typeAndValue_1[0] === 'straight') && (!(typeAndValue_2[0] === 'straight'))){//hand 1 straight, hand 2 not straight
		return [hand1, typeAndValue_1];
	}
	else if((!(typeAndValue_1[0] === 'straight')) && (typeAndValue_2[0] === 'straight')){//hand 2 straight, hand 1 not straight
		return [hand2, typeAndValue_2];
	}
	else{//neither straight
		return tripsRule(hand1, hand2, typeAndValue_1, typeAndValue_2);
	}
}

function triple_array(hand, typeAndValue, justCheckBoolean = false){				

	if(typeAndValue[0] === 'fullHouseOrTwoPairOrPair'){//pair at idx 0 looking for trips at idx 2	
		let sorted_hand = descendingOrder(hand);
		let idx = 2;

		if (sorted_hand[idx].value === sorted_hand[idx+1].value){//at least a pair

			if(sorted_hand[idx+1].value === sorted_hand[idx+2].value) {//trips so full house
				return ['full house', [sorted_hand[idx].value, typeAndValue[1][1]]];
			}
			else{//twoPair
				return ['two pair', [typeAndValue[1][1], sorted_hand[idx].value]];
			}
		}
		else{//twoPairOrPair (didn't check last two elements for pair)
			if(justCheckBoolean){
				typeAndValue = ['twoPairOrPair', [typeAndValue[1][1], 0]];
				return doubles_array(hand, typeAndValue, true, true);
			}
			return ['twoPairOrPair', [typeAndValue[1][1], 0]];
		}							
	}		

	if(typeAndValue[0] !== 'tripsOrPairOrHighCard'){
		return typeAndValue;
	}

	let sorted_hand = descendingOrder(hand);
	let idx = 2;

	//check for trips at idx 2	
	if(sorted_hand[idx].value === sorted_hand[idx+1].value){//pair so far
		if(sorted_hand[idx+1].value === sorted_hand[idx+2].value){//trips 
			return ['three of a kind', [sorted_hand[idx].value, -1]];
		}
		else{//just pair
			return ['pair', [sorted_hand[idx].value, -1]];
		}					
	}
	else{//no Pair so no trips, could still be 1 pair (didn't check last two elements)
		if(justCheckBoolean){
			typeAndValue = ['pairOrHighCard', [0, -1]];
			return doubles_array(hand, typeAndValue, true);
		}
		return ['pairOrHighCard', [0, -1]];
	}
}
function tripsRule(hand1, hand2, typeAndValue_1, typeAndValue_2){	
	typeAndValue_1 = triple_array(hand1, typeAndValue_1);
	typeAndValue_2 = triple_array(hand2, typeAndValue_2);

	if((typeAndValue_1[0] === 'three of a kind') && (typeAndValue_2[0] === 'three of a kind')){//both are trips
		if (typeAndValue_1[1][0] > typeAndValue_2[1][0]){//hand 1 higher trips than hand 2
			return [hand1, typeAndValue_1];
		}
		else if (typeAndValue_1[1][0] < typeAndValue_2[1][0]){//hand 2 higher trips than hand 1
			return [hand2, typeAndValue_2];
		}
		else{//equal trips, kicker plays
			return singlesRule(hand1, hand2, typeAndValue_1);
		}
	}
	else if((typeAndValue_1[0] === 'three of a kind') && (!(typeAndValue_2[0] === 'three of a kind'))){//hand 1 trips, hand 2 not
		return [hand1, typeAndValue_1];
	}
	else if ((!(typeAndValue_1[0] === 'three of a kind')) && (typeAndValue_2[0] === 'three of a kind')){//hand 2 trips, hand 1 not
		return [hand2, typeAndValue_2];
	}
	else{//neither trips
		return twoPairRule(hand1, hand2, typeAndValue_1, typeAndValue_2);
	}
}	
function doubles_array(hand, typeAndValue, justCheckBoolean = false, twoPairCheckBoolean = false) {

	if(typeAndValue[0] === 'fullHouseOrTrips'){//trips at idx 0, check for pair at idx 3 for full house
		let idx = 3;
		let sorted_hand = descendingOrder(hand);

		if(sorted_hand[idx].value === sorted_hand[idx+1].value){//full house
			return ['full house', [typeAndValue[1][0], sorted_hand[idx].value]];
		}
		else{//trips
			return ['three of a kind', [typeAndValue[1][0], -1]];
		}
	}	

	if(twoPairCheckBoolean){

		if(typeAndValue[0] === 'twoPairOrPair'){
			let idx = 3;
			let sorted_hand = descendingOrder(hand);

			if(sorted_hand[idx].value === sorted_hand[idx+1].value){//pair to make two pair
				return ['two pair', [typeAndValue[1][0], sorted_hand[idx].value]];
			}
			else{//no pair, so just pair
				return ['pair', [typeAndValue[1][0], -1]];
			}		
		}
		else{//two pair, or pair, or pairOrHighCard, or high card
			return doubles_array(hand, typeAndValue, true);
		}		
	}

	if(typeAndValue[0] !== 'pairOrHighCard'){//pair or high card
		return typeAndValue;
	}

	let idx = 3;
	let sorted_hand = descendingOrder(hand);

	if(sorted_hand[idx].value === sorted_hand[idx+1].value){//pair
		return ['pair', [sorted_hand[idx].value, -1]];
	}
	else{//no pair
		return ['high card', [sorted_hand[0].value, -1]];
	}		
}
function twoPairRule(hand1, hand2, typeAndValue_1, typeAndValue_2){	

	typeAndValue_1 = doubles_array(hand1, typeAndValue_1, false, true);
	typeAndValue_2 = doubles_array(hand2, typeAndValue_2, false, true);	
	

	if ((typeAndValue_1[0] === 'two pair') && (typeAndValue_2[0] === 'two pair')){//both 2 pairs
		if(typeAndValue_1[1][0] > typeAndValue_2[1][0]){//hand 1 has higher higher pair 
			return [hand1, typeAndValue_1];
		}
		else if(typeAndValue_1[1][0] < typeAndValue_2[1][0]){//hand 2 has higher higher pair
			return [hand2, typeAndValue_2];
		}
		else{//both higher pairs equal
			if(typeAndValue_1[1][1] > typeAndValue_2[1][1]){//hand 1 higher lower pair
				return [hand1, typeAndValue_1];
			}
			else if(typeAndValue_1[1][1] < typeAndValue_2[1][1]){//hand 2 higher lower pair
				return [hand2, typeAndValue_2];
			}
			else{//if both 2 lowers pairs equal, then kicker plays 
				return singlesRule(hand1, hand2, typeAndValue_1);
			}
		}
	}
	else if ((typeAndValue_1[0] === 'two pair') && (!(typeAndValue_2[0] === 'two pair'))){//hand1 2 pair, hand 2 not
		return [hand1, typeAndValue_1];		
	}
	else if ((!(typeAndValue_1[0] === 'two pair')) && (typeAndValue_2[0] === 'two pair')){//hand2 2 pair, hand 1 not 
		return [hand2, typeAndValue_2];		
	}
	else{//if neither 2 pair
		return pairRule(hand1, hand2, typeAndValue_1, typeAndValue_2);
	}
}
function pairRule(hand1, hand2, typeAndValue_1, typeAndValue_2){	
	typeAndValue_1 = doubles_array(hand1, typeAndValue_1);
	typeAndValue_2 = doubles_array(hand2, typeAndValue_2);
	
	if ((typeAndValue_1[0] === 'pair') && (typeAndValue_2[0] === 'pair')){//both pairs
		if(typeAndValue_1[1][0] > typeAndValue_2[1][0]){
			return [hand1, typeAndValue_1];
		}
		else if(typeAndValue_1[1][0] < typeAndValue_2[1][0]){
			return [hand2, typeAndValue_2];
		}
		else{//equal pairs, kicker plays
			return singlesRule(hand1, hand2, typeAndValue_1);
		}
	}
	else if ((typeAndValue_1[0] === 'pair') && (!(typeAndValue_2[0] === 'pair'))){//hand 1 pair, hand 2 not
		return [hand1, typeAndValue_1];
	}
	else if ((!(typeAndValue_1[0] === 'pair')) && (typeAndValue_2[0] === 'pair')){//hand 2 pair, hand 1 not
		return [hand2, typeAndValue_2];
	}
	else{//neither pair
		return singlesRule(hand1, hand2);
	}
}

function singlesRule(hand1, hand2, typeAndValue = ['high card', [0,-1]]){		
	let sorted1 = descendingOrder(hand1);
	let sorted2 = descendingOrder(hand2);

	let idx = 0;
	
	//kicker for pair, two pair, trips, quads
	//regular for high card and flush 
	
	while(idx < 5){
		if (sorted1[idx].value === sorted2[idx].value){
			idx++;

			if (idx === 5){//chop
				if (typeAndValue[1][0] == 0){
					typeAndValue[1][0] = sorted1[0].value;
				}
				return [hand1, typeAndValue];
			}
		}
		else if((sorted1[idx].value > sorted2[idx].value)){
			if (typeAndValue[1][0] == 0){
				typeAndValue[1][0] = sorted1[0].value;
			}
			return [hand1, typeAndValue];			
		}
		else{//sorted1[idx].value < sorted2[idx].value
			if (typeAndValue[1][0] == 0){
				typeAndValue[1][0] = sorted2[0].value;
			}
			return [hand2, typeAndValue];
		}		
	}
}

function winningHand(hand1, hand2, typeAndValue_1 = ['', [0, 0]], typeAndValue_2 = ['', [0, 0]]){
	return straightFlushRule(hand1.concat(), hand2.concat(), typeAndValue_1.concat(), typeAndValue_2.concat());	
}

function getHandType(hand){
	return straightFlushCheck(hand, typeAndValue = ['', [0, 0]], true);	
}
//both hands type are same below
function compareHands(hand1Info, hand2Info){//used to compare winningHand with playersHand to see if same/tied
	
	if ((hand1Info[1][0] == 'straight flush')||(hand1Info[1][0] == 'flush')){//suits don't matter here
		return JSON.stringify(hand1Info[0]) == JSON.stringify(hand2Info[0]);
	}
	else{
		const sorted1 = descendingOrder(hand1Info[0]);
		const sorted2 = descendingOrder(hand2Info[0]);

		for (let i = 0; i < 5; i++){
			if(sorted1[i].value == sorted2[i].value){//same value
				if (i == 4){
					return true;
				}
				continue;
			}
			else{
				return false;
			}
		}
	}
}

function convertNumtoCardStr(numInput, pluralBool = false){
	let endStr = '';
	if(pluralBool){
		if(numInput == 6){
			endStr = "es"
		}
		else{
			endStr = "s"
		}
	}

	if(numInput == 14){
		return "Ace" + endStr;
	}
	else if(numInput == 13){
		return "King" + endStr;
	}
	else if(numInput == 12){
		return "Queen" + endStr;
	}
	else if(numInput == 11){
		return "Jack" + endStr;
	}
	else if(numInput == 10){
		return "Ten" + endStr;
	}
	else if(numInput == 9){
		return "Nine" + endStr;
	}
	else if(numInput == 8){
		return "Eight" + endStr;
	}
	else if(numInput == 7){
		return "Seven" + endStr;
	}
	else if(numInput == 6){
		return "Six" + endStr;
	}
	else if(numInput == 5){
		return "Five" + endStr;
	}
	else if(numInput == 4){
		return "Four" + endStr;
	}
	else if(numInput == 3){
		return "Three" + endStr;
	}
	else{//2
		return "Two" + endStr;
	}

}

function convertTypeValToStr(typeAndValue){
	if (typeAndValue[0] == "straight flush"){		
		return convertNumtoCardStr(typeAndValue[1][0]) + " High straight flush";
	}
	else if (typeAndValue[0] == "four of a kind"){
		return  "Quad " + convertNumtoCardStr(typeAndValue[1][0], true);
	}
	else if (typeAndValue[0] == "full house"){
		return convertNumtoCardStr(typeAndValue[1][0], true) + " full of " 
		+ convertNumtoCardStr(typeAndValue[1][1], true);
	}
	else if (typeAndValue[0] == "flush"){
		return convertNumtoCardStr(typeAndValue[1][0]) + " High flush";
	}
	else if (typeAndValue[0] == "straight"){
		return convertNumtoCardStr(typeAndValue[1][0]) + " High straight"; 
	}
	else if (typeAndValue[0] == "three of a kind"){
		return  "Trip " + convertNumtoCardStr(typeAndValue[1][0], true);
	}
	else if (typeAndValue[0] == "two pair"){
		return  "Two Pair, " + convertNumtoCardStr(typeAndValue[1][0], true) + " & " 
		+ convertNumtoCardStr(typeAndValue[1][1], true);
	}
	else if (typeAndValue[0] == "pair"){
		return  "A pair of " + convertNumtoCardStr(typeAndValue[1][0], true);
	}
	else{//high card
		return convertNumtoCardStr(typeAndValue[1][0]) + " High";
	}

}

module.exports.winningHand = winningHand;
module.exports.compareHands = compareHands;
module.exports.getHandType = getHandType;
module.exports.convertTypeValToStr = convertTypeValToStr;