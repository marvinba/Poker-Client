function extractPropVal(inputStr){
    return parseFloat(inputStr.substring(0, inputStr.length - 2))
}
function idxOfCoordinates (inputSize){
    if (inputSize == 2){
        return 0;
    }
    else if ((inputSize > 2) && (inputSize <= 6)){
        return 1;
    }
    else if ((inputSize > 6) && (inputSize <= 8)){
        return 2;
    }
    else if (inputSize == 9){
        return 3;
    }
    else{//10
        return 4;
    }                
}
function bestHandsOutput(tableSzIdx, currentSeat, elemWidth){
    //2-max
    if(tableSzIdx == 0){//doesnt matter which seat
        const intialValue = extractPropVal(bestHandsAllSizes[tableSzIdx][currentSeat][0]);
        return (intialValue - (elemWidth/2)) + "px";
    }
    //6-max
    else if(tableSzIdx == 1){//seats 3 - 6 change, seats 1 and 2 remain untouched
        if((currentSeat == 2)||(currentSeat == 5)){//2 represents seat 3, 5 represents seat 6 here
            const intialValue = extractPropVal(bestHandsAllSizes[tableSzIdx][currentSeat][0]);
            return (intialValue - (elemWidth/2)) + "px";
        }
        else if((currentSeat == 3)||(currentSeat == 4)){//represents seat 4 and 5
            const intialValue = extractPropVal(bestHandsAllSizes[tableSzIdx][currentSeat][0]);
            return (intialValue - elemWidth) + "px";
        }
        else{
            return bestHandsAllSizes[tableSzIdx][currentSeat][0];
        }
    }
    //8-max
    else if(tableSzIdx == 2){
        if((currentSeat == 0)||(currentSeat == 3)){//represents seat 1 and 4 here
            const intialValue = extractPropVal(bestHandsAllSizes[tableSzIdx][currentSeat][0]);
            return (intialValue - (elemWidth/2)) + "px";
        }
        else if ((currentSeat == 1)||(currentSeat == 2)){//seats 2 and 3
            return bestHandsAllSizes[tableSzIdx][currentSeat][0];
        }
        else if ((currentSeat == 5)||(currentSeat == 6)){//seats 6 and 7 right is left of seatDiv
            const intialValue = extractPropVal(bestHandsAllSizes[tableSzIdx][currentSeat][0]);
            return (intialValue - elemWidth) + "px";
        }
        else if((currentSeat == 4)||(currentSeat == 7)){//seats 5 and 8
            const intialValue = extractPropVal(bestHandsAllSizes[tableSzIdx][currentSeat][0]);
            return (intialValue - (elemWidth/2)) + "px";
        }

    }
    //9-max
    else if(tableSzIdx == 3){
        if((currentSeat == 0)||(currentSeat == 4)||(currentSeat == 5)){
            const intialValue = extractPropVal(bestHandsAllSizes[tableSzIdx][currentSeat][0]);
            return (intialValue - (elemWidth/2)) + "px";
        }
        else if((currentSeat == 1)||(currentSeat == 2)||(currentSeat == 3)){
            return bestHandsAllSizes[tableSzIdx][currentSeat][0];
        }
        else{//currentSeat 6, 7, 8 
            const intialValue = extractPropVal(bestHandsAllSizes[tableSzIdx][currentSeat][0]);
            return (intialValue - elemWidth) + "px";
        }
    }
    //10-max
    else{//4
        if ((currentSeat == 0)||(currentSeat == 4)||(currentSeat == 5)){
            const intialValue = extractPropVal(bestHandsAllSizes[tableSzIdx][currentSeat][0]);
            return (intialValue - (elemWidth/2)) + "px";
        }
        else if ((currentSeat == 1)||(currentSeat == 2)||(currentSeat == 3)){
            return bestHandsAllSizes[tableSzIdx][currentSeat][0];
        }
        else{
            const intialValue = extractPropVal(bestHandsAllSizes[tableSzIdx][currentSeat][0]);
            return (intialValue - elemWidth) + "px";
        }
    }
}
function bestActionOutput(tableSzIdx, currentSeat, elemWidth){
    //2-max
    if(tableSzIdx == 0){//doesnt matter which seat
        const intialValue = extractPropVal(bestActionsAllSizes[tableSzIdx][currentSeat][0]);
        return (intialValue - (elemWidth/2)) + "px";
    }
    //6-max
    else if(tableSzIdx == 1){//seats 3 - 6 change, seats 1 and 2 remain untouched
        if((currentSeat == 2)||(currentSeat == 5)){//2 represents seat 3, 5 represents seat 6 here
            const intialValue = extractPropVal(bestActionsAllSizes[tableSzIdx][currentSeat][0]);
            return (intialValue - (elemWidth/2)) + "px";
        }
        else if((currentSeat == 3)||(currentSeat == 4)){//represents seat 4 and 5
            const intialValue = extractPropVal(bestActionsAllSizes[tableSzIdx][currentSeat][0]);
            return (intialValue - elemWidth) + "px";
        }
        else{
            return bestActionsAllSizes[tableSzIdx][currentSeat][0];
        }
    }
    //8-max
    else if(tableSzIdx == 2){
        if((currentSeat == 0)||(currentSeat == 3)){//represents seat 1 and 4 here
            const intialValue = extractPropVal(bestActionsAllSizes[tableSzIdx][currentSeat][0]);
            return (intialValue - (elemWidth/2)) + "px";
        }
        else if ((currentSeat == 1)||(currentSeat == 2)){//seats 2 and 3
            return bestActionsAllSizes[tableSzIdx][currentSeat][0];
        }
        else if ((currentSeat == 5)||(currentSeat == 6)){//seats 6 and 7 right is left of seatDiv
            const intialValue = extractPropVal(bestActionsAllSizes[tableSzIdx][currentSeat][0]);
            return (intialValue - elemWidth) + "px";
        }
        else if((currentSeat == 4)||(currentSeat == 7)){//seats 5 and 8
            const intialValue = extractPropVal(bestActionsAllSizes[tableSzIdx][currentSeat][0]);
            return (intialValue - (elemWidth/2)) + "px";
        }

    }
    //9-max
    else if(tableSzIdx == 3){
        if((currentSeat == 0)||(currentSeat == 4)||(currentSeat == 5)){
            const intialValue = extractPropVal(bestActionsAllSizes[tableSzIdx][currentSeat][0]);
            return (intialValue - (elemWidth/2)) + "px";
        }
        else if((currentSeat == 1)||(currentSeat == 2)||(currentSeat == 3)){
            return bestActionsAllSizes[tableSzIdx][currentSeat][0];
        }
        else{//currentSeat 6, 7, 8 
            const intialValue = extractPropVal(bestActionsAllSizes[tableSzIdx][currentSeat][0]);
            return (intialValue - elemWidth) + "px";
        }
    }
    //10-max
    else{//4
        if ((currentSeat == 0)||(currentSeat == 4)||(currentSeat == 5)){
            const intialValue = extractPropVal(bestActionsAllSizes[tableSzIdx][currentSeat][0]);
            return (intialValue - (elemWidth/2)) + "px";
        }
        else if ((currentSeat == 1)||(currentSeat == 2)||(currentSeat == 3)){
            return bestActionsAllSizes[tableSzIdx][currentSeat][0];
        }
        else{
            const intialValue = extractPropVal(bestActionsAllSizes[tableSzIdx][currentSeat][0]);
            return (intialValue - elemWidth) + "px";
        }
    }
}
function chipBetsOutput(tableSzIdx, currentSeat, numStacks, chipWidth){
    const leftString = betChipsAllSizes[tableSzIdx][currentSeat][0];
    //2-max
    if(tableSzIdx == 0){
        if (currentSeat < Math.ceil(2/2)){//chips from right side, text on left
            return (parseFloat(leftString.substring(0, leftString.length - 2)) - (numStacks * chipWidth)) + "px"; 
        }
        else{//chips from left side, text on right
            return (parseFloat(leftString.substring(0, leftString.length - 2))) + "px"; 
        }
    }
    //6-max
    else if(tableSzIdx == 1){
        if ((currentSeat == 2)){//right to left
            return (parseFloat(leftString.substring(0, leftString.length - 2)) - (numStacks * chipWidth)) + "px"; 
        }
        else if((currentSeat == 5)){//left to right
            return (parseFloat(leftString.substring(0, leftString.length - 2))) + "px"; 
        }
        else if((currentSeat == 0) || (currentSeat == 1)){//position the same, text on right
            return (parseFloat(leftString.substring(0, leftString.length - 2))) + "px"; 
        }
        else{//position the same, text on left
            return (parseFloat(leftString.substring(0, leftString.length - 2)) - (numStacks * chipWidth)) + "px"; 
        }
    }
    //8-max
    else if(tableSzIdx == 2){
        if((currentSeat == 0)){//right to left, text on left
            return (parseFloat(leftString.substring(0, leftString.length - 2)) - (numStacks * chipWidth)) + "px"; 
        }
        else if((currentSeat == 1) || (currentSeat == 2)){//position the same, text on right
            return (parseFloat(leftString.substring(0, leftString.length - 2))) + "px"; 
        }
        else if((currentSeat == 3)){//right to left, text on left
            return (parseFloat(leftString.substring(0, leftString.length - 2)) - (numStacks * chipWidth)) + "px"; 
        }
        else if((currentSeat == 4)){//left to right, text on right
            return (parseFloat(leftString.substring(0, leftString.length - 2))) + "px"; 
        }
        else if((currentSeat == 5) || (currentSeat == 6)){//position the same, text on left
            return (parseFloat(leftString.substring(0, leftString.length - 2)) - (numStacks * chipWidth)) + "px"; 
        }
        else{//7, text on right
            return (parseFloat(leftString.substring(0, leftString.length - 2))) + "px"; 
        }
    }
    //9-max
    else if(tableSzIdx == 3){
        if (currentSeat == 0){//text on right
            return (parseFloat(leftString.substring(0, leftString.length - 2))) + "px"; 
        }
        else if (currentSeat == 1){//position the same, text on left
            return (parseFloat(leftString.substring(0, leftString.length - 2)) - (numStacks * chipWidth)) + "px"; 
        }
        else if ((currentSeat == 2) || (currentSeat == 3)){//position the same, text on right
            return (parseFloat(leftString.substring(0, leftString.length - 2))) + "px"; 
        }
        else if (currentSeat == 4){//text on left
            return (parseFloat(leftString.substring(0, leftString.length - 2)) - (numStacks * chipWidth)) + "px"; 
        }
        else if (currentSeat == 5){//text on right
            return (parseFloat(leftString.substring(0, leftString.length - 2))) + "px"; 
        }
        else if ((currentSeat == 6) && (currentSeat == 7)){//position the same, text on left
            return (parseFloat(leftString.substring(0, leftString.length - 2)) - (numStacks * chipWidth)) + "px"; 
        }
        else{//8, position the same, text on left
            return (parseFloat(leftString.substring(0, leftString.length - 2)) - (numStacks * chipWidth)) + "px"; 
        }
    }
    //10-max
    else{//tableSzIdx == 4
        if (currentSeat == 0){//left to right, text on right
            return (parseFloat(leftString.substring(0, leftString.length - 2))) + "px"; 
        }
        else if (currentSeat == 1){//same position, right to left
            return (parseFloat(leftString.substring(0, leftString.length - 2)) - (numStacks * chipWidth)) + "px"; 
        }
        else if ((currentSeat == 2) || (currentSeat == 3)){//position the same, text on right
            return (parseFloat(leftString.substring(0, leftString.length - 2))) + "px"; 
        }
        else if (currentSeat == 4){//same position, right to left, text on right
            return (parseFloat(leftString.substring(0, leftString.length - 2)) - (numStacks * chipWidth)) + "px"; 
        }
        else if (currentSeat == 5){//left to right, text on right
            return (parseFloat(leftString.substring(0, leftString.length - 2))) + "px"; 
        }
        else if ((currentSeat == 6)){//same position left side on right, text on left
            return (parseFloat(leftString.substring(0, leftString.length - 2)) - (numStacks * chipWidth)) + "px"; 
        }
        else if ((currentSeat == 7) || (currentSeat == 8)){//same position left side on right, text on left
            return (parseFloat(leftString.substring(0, leftString.length - 2)) - (numStacks * chipWidth)) + "px"; 
        }
        else{//9, same position left side, text on left
            return (parseFloat(leftString.substring(0, leftString.length - 2)) - (numStacks * chipWidth)) + "px"; 
        }
    }
}
function betTextOutput(amount, tableSz, currentSeat){   
    const idxSetCoordinates = idxOfCoordinates(tableSz);
    const seatNum = currentSeat + 1;
    
    const betText = document.getElementById('action'+ seatNum + 'Text');
    const parentDiv = document.getElementById('action' + seatNum + 'Div');

    let printedAmt = parseFloat(amount).toFixed(2);
    if (printedAmt.substring(printedAmt.length - 3, printedAmt.length) == '.00'){
        printedAmt = printedAmt.substring(0, printedAmt.length - 3);
    }
    betText.textContent = '';
    betText.appendChild(document.createTextNode('$' + printedAmt));
    betText.style.display = "inline-block";
    betText.style.position = "absolute";

    const textPos = betText.getBoundingClientRect();

    //to left of something, subtract width as well as 8 px 

    if (idxSetCoordinates == 0){//2-max
        if (currentSeat == 0){//left of chips on right side
            const firstChip = parentDiv.getElementsByClassName('betStacks')[0].firstChild.firstChild;
            const firstChipPos = firstChip.getBoundingClientRect();
            
            betText.style.left = (firstChipPos.left - textPos.width - 8) + "px";
            const topString = betChipsAllSizes[idxSetCoordinates][currentSeat][1];
            betText.style.top = (parseFloat(topString.substring(0, topString.length - 2)) + 18.8 - textPos.height - 3) + "px"//bottom of stacks would be bottom of text
        }
        else{//right of chips on left side
            const lastChip = parentDiv.getElementsByClassName('betStacks')[0].lastChild.firstChild;
            const lastChipPos = lastChip.getBoundingClientRect();

            betText.style.left = (lastChipPos.right + 8) + "px";
            const topString = betChipsAllSizes[idxSetCoordinates][currentSeat][1];
            betText.style.top = (parseFloat(topString.substring(0, topString.length - 2)) + 18.8 - textPos.height - 3) + "px"//bottom of stacks would be bottom of text
        }
    }
    else if (idxSetCoordinates == 1){//6-max
        if ((currentSeat == 0) || (currentSeat == 1)){//position the same, right of chips
            const lastChip = parentDiv.getElementsByClassName('betStacks')[0].lastChild.firstChild;
            const lastChipPos = lastChip.getBoundingClientRect();

            betText.style.left = (lastChipPos.right + 8) + "px";
            const topString = betChipsAllSizes[idxSetCoordinates][currentSeat][1];
            betText.style.top = (parseFloat(topString.substring(0, topString.length - 2)) + 18.8 - textPos.height - 3) + "px"//bottom of stacks would be bottom of text
        }
        else if (currentSeat == 2){//left of chips on right side
            const firstChip = parentDiv.getElementsByClassName('betStacks')[0].firstChild.firstChild;
            const firstChipPos = firstChip.getBoundingClientRect();
            
            betText.style.left = (firstChipPos.left - textPos.width - 8) + "px";
            const topString = betChipsAllSizes[idxSetCoordinates][currentSeat][1];
            betText.style.top = (parseFloat(topString.substring(0, topString.length - 2)) + 18.8 - textPos.height - 3) + "px"//bottom of stacks would be bottom of text
        }
        else if ((currentSeat == 3) || (currentSeat == 4)){//position the same, text on left
            const firstChip = parentDiv.getElementsByClassName('betStacks')[0].firstChild.firstChild;
            const firstChipPos = firstChip.getBoundingClientRect();
            
            betText.style.left = (firstChipPos.left - textPos.width - 8) + "px";
            const topString = betChipsAllSizes[idxSetCoordinates][currentSeat][1];
            betText.style.top = (parseFloat(topString.substring(0, topString.length - 2)) + 18.8 - textPos.height - 3) + "px"//bottom of stacks would be bottom of text
        }
        else{//5 right of chips on left side
            const lastChip = parentDiv.getElementsByClassName('betStacks')[0].lastChild.firstChild;
            const lastChipPos = lastChip.getBoundingClientRect();

            betText.style.left = (lastChipPos.right + 8) + "px";
            const topString = betChipsAllSizes[idxSetCoordinates][currentSeat][1];
            betText.style.top = (parseFloat(topString.substring(0, topString.length - 2)) + 18.8 - textPos.height - 3) + "px"//bottom of stacks would be bottom of text
        }
    }
    else if (idxSetCoordinates == 2){//8-max
        if(currentSeat == 0){//right to left, text on left
            const firstChip = parentDiv.getElementsByClassName('betStacks')[0].firstChild.firstChild;
            const firstChipPos = firstChip.getBoundingClientRect();
            
            betText.style.left = (firstChipPos.left - textPos.width - 8) + "px";
            const topString = betChipsAllSizes[idxSetCoordinates][currentSeat][1];
            betText.style.top = (parseFloat(topString.substring(0, topString.length - 2)) + 18.8 - textPos.height - 3) + "px"//bottom of stacks would be bottom of text
        }
        else if ((currentSeat == 1) || (currentSeat == 2)){//position the same, text on right
            const lastChip = parentDiv.getElementsByClassName('betStacks')[0].lastChild.firstChild;
            const lastChipPos = lastChip.getBoundingClientRect();

            betText.style.left = (lastChipPos.right + 8) + "px";
            const topString = betChipsAllSizes[idxSetCoordinates][currentSeat][1];
            betText.style.top = (parseFloat(topString.substring(0, topString.length - 2)) + 18.8 - textPos.height - 3) + "px"//bottom of stacks would be bottom of text
        }
        else if(currentSeat == 3){//right to left, text on left
            const firstChip = parentDiv.getElementsByClassName('betStacks')[0].firstChild.firstChild;
            const firstChipPos = firstChip.getBoundingClientRect();
            
            betText.style.left = (firstChipPos.left - textPos.width - 8) + "px";
            const topString = betChipsAllSizes[idxSetCoordinates][currentSeat][1];
            betText.style.top = (parseFloat(topString.substring(0, topString.length - 2)) + 18.8 - textPos.height - 3) + "px"//bottom of stacks would be bottom of text
        }
        else if(currentSeat == 4){//left to right, text on right
            const lastChip = parentDiv.getElementsByClassName('betStacks')[0].lastChild.firstChild;
            const lastChipPos = lastChip.getBoundingClientRect();

            betText.style.left = (lastChipPos.right + 8) + "px";
            const topString = betChipsAllSizes[idxSetCoordinates][currentSeat][1];
            betText.style.top = (parseFloat(topString.substring(0, topString.length - 2)) + 18.8 - textPos.height - 3) + "px"//bottom of stacks would be bottom of text
        }
        else if ((currentSeat == 5) || (currentSeat == 6)){//position the same, text on left
            const firstChip = parentDiv.getElementsByClassName('betStacks')[0].firstChild.firstChild;
            const firstChipPos = firstChip.getBoundingClientRect();
            
            betText.style.left = (firstChipPos.left - textPos.width - 8) + "px";
            const topString = betChipsAllSizes[idxSetCoordinates][currentSeat][1];
            betText.style.top = (parseFloat(topString.substring(0, topString.length - 2)) + 18.8 - textPos.height - 3) + "px"//bottom of stacks would be bottom of text
        }
        else{//7 left to right, text on right
            const lastChip = parentDiv.getElementsByClassName('betStacks')[0].lastChild.firstChild;
            const lastChipPos = lastChip.getBoundingClientRect();

            betText.style.left = (lastChipPos.right + 8) + "px";
            const topString = betChipsAllSizes[idxSetCoordinates][currentSeat][1];
            betText.style.top = (parseFloat(topString.substring(0, topString.length - 2)) + 18.8 - textPos.height - 3) + "px"//bottom of stacks would be bottom of text
        }
    }
    else if (idxSetCoordinates == 3){//9-max
        if(currentSeat == 0){//left to right, text on right
            const lastChip = parentDiv.getElementsByClassName('betStacks')[0].lastChild.firstChild;
            const lastChipPos = lastChip.getBoundingClientRect();

            betText.style.left = (lastChipPos.right + 8) + "px";
            const topString = betChipsAllSizes[idxSetCoordinates][currentSeat][1];
            betText.style.top = (parseFloat(topString.substring(0, topString.length - 2)) + 18.8 - textPos.height - 3) + "px"//bottom of stacks would be bottom of text
        }
        else if(currentSeat == 1){//position the same, text on right
            const lastChip = parentDiv.getElementsByClassName('betStacks')[0].lastChild.firstChild;
            const lastChipPos = lastChip.getBoundingClientRect();

            betText.style.left = (lastChipPos.right + 8) + "px";
            const topString = betChipsAllSizes[idxSetCoordinates][currentSeat][1];
            betText.style.top = (parseFloat(topString.substring(0, topString.length - 2)) + 18.8 - textPos.height - 3) + "px"//bottom of stacks would be bottom of text
        }
        else if ((currentSeat == 2) || (currentSeat == 3)){//position the same, text on right
            const lastChip = parentDiv.getElementsByClassName('betStacks')[0].lastChild.firstChild;
            const lastChipPos = lastChip.getBoundingClientRect();

            betText.style.left = (lastChipPos.right + 8) + "px";
            const topString = betChipsAllSizes[idxSetCoordinates][currentSeat][1];
            betText.style.top = (parseFloat(topString.substring(0, topString.length - 2)) + 18.8 - textPos.height - 3) + "px"//bottom of stacks would be bottom of text
        }
        else if(currentSeat == 4){//right to left, text on left
            const firstChip = parentDiv.getElementsByClassName('betStacks')[0].firstChild.firstChild;
            const firstChipPos = firstChip.getBoundingClientRect();
            
            betText.style.left = (firstChipPos.left - textPos.width - 8) + "px";
            const topString = betChipsAllSizes[idxSetCoordinates][currentSeat][1];
            betText.style.top = (parseFloat(topString.substring(0, topString.length - 2)) + 18.8 - textPos.height - 3) + "px"//bottom of stacks would be bottom of text
        }
        else if(currentSeat == 5){//left to right, text on right
            const lastChip = parentDiv.getElementsByClassName('betStacks')[0].lastChild.firstChild;
            const lastChipPos = lastChip.getBoundingClientRect();

            betText.style.left = (lastChipPos.right + 8) + "px";
            const topString = betChipsAllSizes[idxSetCoordinates][currentSeat][1];
            betText.style.top = (parseFloat(topString.substring(0, topString.length - 2)) + 18.8 - textPos.height - 3) + "px"//bottom of stacks would be bottom of text
        }
        else if ((currentSeat == 6) || (currentSeat == 7)){//position the same, text on left
            const firstChip = parentDiv.getElementsByClassName('betStacks')[0].firstChild.firstChild;
            const firstChipPos = firstChip.getBoundingClientRect();
            
            betText.style.left = (firstChipPos.left - textPos.width - 8) + "px";
            const topString = betChipsAllSizes[idxSetCoordinates][currentSeat][1];
            betText.style.top = (parseFloat(topString.substring(0, topString.length - 2)) + 18.8 - textPos.height - 3) + "px"//bottom of stacks would be bottom of text
        }
        else{//position the same, text on left
            const firstChip = parentDiv.getElementsByClassName('betStacks')[0].firstChild.firstChild;
            const firstChipPos = firstChip.getBoundingClientRect();
            
            betText.style.left = (firstChipPos.left - textPos.width - 8) + "px";
            const topString = betChipsAllSizes[idxSetCoordinates][currentSeat][1];
            betText.style.top = (parseFloat(topString.substring(0, topString.length - 2)) + 18.8 - textPos.height - 3) + "px"//bottom of stacks would be bottom of text
        }
    }
    else{//4 10-max
        if(currentSeat == 0){//left to right, text on right
            const lastChip = parentDiv.getElementsByClassName('betStacks')[0].lastChild.firstChild;
            const lastChipPos = lastChip.getBoundingClientRect();

            betText.style.left = (lastChipPos.right + 8) + "px";
            const topString = betChipsAllSizes[idxSetCoordinates][currentSeat][1];
            betText.style.top = (parseFloat(topString.substring(0, topString.length - 2)) + 18.8 - textPos.height - 3) + "px"//bottom of stacks would be bottom of text
        }
        else if(currentSeat == 1){//same position, right to left, text on right
            const firstChip = parentDiv.getElementsByClassName('betStacks')[0].firstChild.firstChild;
            const firstChipPos = firstChip.getBoundingClientRect();
            
            betText.style.left = (firstChipPos.left - textPos.width - 8) + "px";
            const topString = betChipsAllSizes[idxSetCoordinates][currentSeat][1];
            betText.style.top = (parseFloat(topString.substring(0, topString.length - 2)) + 18.8 - textPos.height - 3) + "px"//bottom of stacks would be bottom of text
        }
        else if ((currentSeat == 2) || (currentSeat == 3)){//same position, text on right
            const lastChip = parentDiv.getElementsByClassName('betStacks')[0].lastChild.firstChild;
            const lastChipPos = lastChip.getBoundingClientRect();

            betText.style.left = (lastChipPos.right + 8) + "px";
            const topString = betChipsAllSizes[idxSetCoordinates][currentSeat][1];
            betText.style.top = (parseFloat(topString.substring(0, topString.length - 2)) + 18.8 - textPos.height - 3) + "px"//bottom of stacks would be bottom of text
        }
        else if(currentSeat == 4){//same position, right to left, text on right
            const lastChip = parentDiv.getElementsByClassName('betStacks')[0].lastChild.firstChild;
            const lastChipPos = lastChip.getBoundingClientRect();

            betText.style.left = (lastChipPos.right + 8) + "px";
            const topString = betChipsAllSizes[idxSetCoordinates][currentSeat][1];
            betText.style.top = (parseFloat(topString.substring(0, topString.length - 2)) + 18.8 - textPos.height - 3) + "px"//bottom of stacks would be bottom of text
        }
        else if(currentSeat == 5){//left to right, text on right
            const lastChip = parentDiv.getElementsByClassName('betStacks')[0].lastChild.firstChild;
            const lastChipPos = lastChip.getBoundingClientRect();

            betText.style.left = (lastChipPos.right + 8) + "px";
            const topString = betChipsAllSizes[idxSetCoordinates][currentSeat][1];
            betText.style.top = (parseFloat(topString.substring(0, topString.length - 2)) + 18.8 - textPos.height - 3) + "px"//bottom of stacks would be bottom of text
        }
        else if(currentSeat == 6){//same position left side, text on left
            const firstChip = parentDiv.getElementsByClassName('betStacks')[0].firstChild.firstChild;
            const firstChipPos = firstChip.getBoundingClientRect();
            
            betText.style.left = (firstChipPos.left - textPos.width - 8) + "px";
            const topString = betChipsAllSizes[idxSetCoordinates][currentSeat][1];
            betText.style.top = (parseFloat(topString.substring(0, topString.length - 2)) + 18.8 - textPos.height - 3) + "px"//bottom of stacks would be bottom of text
        }
        else if ((currentSeat == 7) || (currentSeat == 8)){//same position left side, text on left
            const firstChip = parentDiv.getElementsByClassName('betStacks')[0].firstChild.firstChild;
            const firstChipPos = firstChip.getBoundingClientRect();
            
            betText.style.left = (firstChipPos.left - textPos.width - 8) + "px";
            const topString = betChipsAllSizes[idxSetCoordinates][currentSeat][1];
            betText.style.top = (parseFloat(topString.substring(0, topString.length - 2)) + 18.8 - textPos.height - 3) + "px"//bottom of stacks would be bottom of text
        }
        else{//9 same position left side, text on left
            const firstChip = parentDiv.getElementsByClassName('betStacks')[0].firstChild.firstChild;
            const firstChipPos = firstChip.getBoundingClientRect();
            
            betText.style.left = (firstChipPos.left - textPos.width - 8) + "px";
            const topString = betChipsAllSizes[idxSetCoordinates][currentSeat][1];
            betText.style.top = (parseFloat(topString.substring(0, topString.length - 2)) + 18.8 - textPos.height - 3) + "px"//bottom of stacks would be bottom of text
        }
    }    
}
function convertChipToNum(chipString){
    if(chipString[chipString.length - 1] == "M"){
        return parseInt(chipString.substring(0, chipString.length - 1))*1000000;
    }
    else if(chipString[chipString.length - 1] == "K"){
        return parseInt(chipString.substring(0, chipString.length - 1))*1000;
    }
    else if (chipString.substring(chipString.length - 4, chipString.length) == "cent"){
        return parseFloat(parseFloat(chipString.substring(0, chipString.length - 4)/100).toFixed(2));
    }
    else{
        return parseInt(chipString)
    }
}
function numChipsForEach(amount, betAmountArr){
    let chipDenomNumArr = [];
    let allBetsDenomArr = [];

    let endAmtIdx = betAmountArr.findIndex(startingBetAmt => startingBetAmt <= amount)//first that is less than equal to amount

    let previousAmt = 0;
    let stacksArr = [];
    if (endAmtIdx == -1){
        betAmountArr = [amount];
        endAmtIdx = 0;
    }

    //inserts all stacks into stacksArr
    for (let i = (betAmountArr.length - 1); i >= endAmtIdx; i--){
        const stackAmount = betAmountArr[i] - previousAmt;
        stacksArr.unshift(stackAmount);
        previousAmt = betAmountArr[i];

       //what if all in call isn't listed as betAmount???
       if (i == endAmtIdx){
           if (amount != betAmountArr[i]){
               stacksArr.unshift((amount - betAmountArr[endAmtIdx]));
           }
       }
    }
    //first 3 bets intact, change below to reflect so instead of 0 to 2 intact
    if (stacksArr.length > 4){//0 to 2 intact, then insert sum of rest to beginning of array
        const tempArr = stacksArr.slice(0, 3);
        const firstElem = stacksArr.slice(3).reduce((a,b) => {return a+b}, 0);
        stacksArr = [firstElem].concat(tempArr);
    }

    //stacksArr is exactly like GUI, everything from left (largest betAmount) to right (lowest betAmount)      
    let j = 0;
    let remainder = stacksArr[j];
    while((remainder > 0) && (j < stacksArr.length)){
        const chipDenomStr = chipAmountStrArr.find(chipAmountStr => convertChipToNum(chipAmountStr) <= remainder);
        const chipDenomNum = convertChipToNum(chipDenomStr);
        
        const numChipDenom = Math.floor(parseFloat(parseFloat(remainder/chipDenomNum).toFixed(2)));

        chipDenomNumArr.unshift([chipDenomStr, numChipDenom]); //chipDenomNumArr starts lowest denom on the left to highest on the right 
        remainder = parseFloat(parseFloat(parseFloat(parseFloat(remainder).toFixed(2)) - parseFloat(parseFloat(numChipDenom * chipDenomNum).toFixed(2))).toFixed(2));
        
        if (remainder == 0){
            allBetsDenomArr.push(chipDenomNumArr);
            chipDenomNumArr = [];
            
            j++;
            if (j != stacksArr.length){
                remainder = stacksArr[j];
            }
        }
    }
    return allBetsDenomArr;
}
function getChipText(chipStr){
    const lastChar = chipStr.slice(-4);

    if (lastChar == 'cent'){
        return chipStr.slice(0, chipStr.length - 4) + '¢';
    }
    else{
        return chipStr;
    }  
}
function numChipsForPot(potArr){//oldest from left to youngest at right
    let chipDenomNumArr = [];
    const allBetsDenomArr = [];

    let j = 0;
    let remainder = potArr[j];

    while((remainder > 0) && (j < potArr.length)){
        const chipDenomStr = chipAmountStrArr.find(chipAmountStr => convertChipToNum(chipAmountStr) <= remainder);
        const chipDenomNum = convertChipToNum(chipDenomStr);
        
        const numChipDenom = Math.floor(parseFloat(parseFloat(remainder/chipDenomNum).toFixed(2)));

        chipDenomNumArr.push([chipDenomStr, numChipDenom]); //highest on left to lowest on right 
        remainder = parseFloat(parseFloat(parseFloat(parseFloat(remainder).toFixed(2)) - parseFloat(parseFloat(numChipDenom * chipDenomNum).toFixed(2))).toFixed(2));
        
        if (remainder == 0){
            allBetsDenomArr.push(chipDenomNumArr);
            chipDenomNumArr = [];
            
            j++;
            remainder = potArr[j];
        }
    }
    return allBetsDenomArr;
}

function displayArrChips(amount, betAmountArr, seatNum, tableSz){
    const idxSetCoordinates = idxOfCoordinates(tableSz);
    const seatIdx = seatNum - 1;

    let addToTop = 0;
    if ((seatNum == 2) && (tableSz >= 9)){
        addToTop = -4;
    }

    //delete player stacks
    const previousParent = document.getElementById('action'+ seatNum + 'Div');
    const previousStacks = previousParent.getElementsByTagName('div');    
    
    if (previousStacks.length > 0){
        previousParent.removeChild(previousStacks[0]);
    }

    const stacksArr = numChipsForEach(amount, betAmountArr);
    const numStacks = stacksArr.length;

    //appends potStacks to pot or rowOfBets to actionDiv
    let stack;
    const actionDiv = document.getElementById('action'+ seatNum + 'Div');
    const rowOfBets = document.createElement('div');
    rowOfBets.setAttribute("class", 'betStacks');
    actionDiv.appendChild(rowOfBets);
    
    //stacksArr is exactly like GUI, everything from left (largest betAmount) to right (lowest betAmount)  
        //chipDenomNumArr starts lowest denom on the left to highest on the right 

    let zIndex = 7000;

    for (let i = 0; i < stacksArr.length; i++){
        const currectStackArr = stacksArr[i];

        for (let j = 0; j < currectStackArr.length; j++){
            const currentDenomArr = currectStackArr[j];

            //creates all chips of current denom and appends to denomStack 
            for (let k = 0; k < currentDenomArr[1]; k++){        
                const chipDiv = document.createElement('div');
                const chipTopDiv = document.createElement('div');

                chipDiv.classList.add("chip");
                chipTopDiv.classList.add("chipTop");
                chipDiv.classList.add("chip" + currentDenomArr[0]);
                chipTopDiv.classList.add("chipTop" + currentDenomArr[0]);
                
                chipTopDiv.appendChild(document.createTextNode(getChipText(currentDenomArr[0])));
                chipDiv.appendChild(chipTopDiv);

                if((j == 0) && (k == 0)){//very first chip of stack                      
                    stack = document.createElement('div');
                    stack.setAttribute("class", 'chipStack');                        

                    rowOfBets.appendChild(stack);
                    
                    stack.appendChild(chipDiv);                        

                    //const actionPos = actionDiv.getElementsByTagName('p')[0].getBoundingClientRect();
                    const chipPos = chipDiv.getBoundingClientRect();

                    if (i != 0){
                        stack.style.position = "relative";
                        stack.style.left = ((chipPos.width) * i) + 'px';
                    }

                    chipDiv.style.position = "absolute";
                    
                    chipDiv.style.left = chipBetsOutput(idxSetCoordinates, seatIdx, numStacks, chipPos.width); //leftVal is really right of betStacks
                    const topString = betChipsAllSizes[idxSetCoordinates][seatIdx][1];
                    chipDiv.style.top = (parseFloat(topString.substring(0, topString.length - 2)) + 18.8 - chipPos.height + addToTop) + "px"//bottom of stacks would be bottom of text 
                    //bestActionsAllSizes[3][seatNum - 1][0];

                    zIndex = 7000;
                    chipDiv.style.zIndex = zIndex;
                    zIndex++;                    
                }
                else{
                    const lastChipPos = stack.lastChild.getBoundingClientRect();
                    
                    stack.appendChild(chipDiv);

                    const currentChipPos = stack.getBoundingClientRect();
                    //const actionPos = actionDiv.getElementsByTagName('p')[0].getBoundingClientRect();
                    const chipPos = chipDiv.getBoundingClientRect();
                    
                    chipDiv.style.position = "absolute";
                    chipDiv.style.zIndex = zIndex;
                    zIndex++;               
                    
                    //put chips on top of previous chip
                    chipDiv.style.top = (lastChipPos.top - currentChipPos.bottom + 11) + "px";
                    chipDiv.style.left = chipBetsOutput(idxSetCoordinates, seatIdx, numStacks, chipPos.width);
                }
            }
        }
    }
}
function displayPotChips(cashGameObj){

    //removes all children
    const parent = document.getElementById('potChips');
    while (parent.firstChild) {
        parent.firstChild.remove()
    }
    //const previousStacks = previousParent.getElementsByClassName('potStacks');
    //previousParent.removeChild(previousStacks);

    const potArr = cashGameObj.tempPots.concat(cashGameObj.allPots);

    const potAmtArr = [];

    //creates potAmtArr in order from oldest to youngest pots
    for (let i = 0; i < potArr.length; i++){
        if(!Array.isArray(potArr[i])){
            potAmtArr.unshift(potArr[i].total);
        }
        else{
            const nestedPotArr = potArr[i];
            for (j = 0; j < nestedPotArr.length; j++){
                potAmtArr.unshift(nestedPotArr[j].total);
            }
        }
    }  

    //check tempPots and allPots
        //if 1 total for both above, then 630-width/2
        //2 or more then rightmost chip of main pot is 10px left of 630 with right side pot's leftmost is 10 px to right of 630 
    
    const numTempPots = cashGameObj.tempPots.length;
    const numAllPots = cashGameObj.allPots.length;
    const totalPots = numTempPots + numAllPots;

    const denomStacksArr = numChipsForPot(potAmtArr);

    let denomStack, potStacks;
    for (let i = 0; i < denomStacksArr.length; i++){
        const currentPotDenoms = denomStacksArr[i];

        //individual row of chips for each pot, might need to create more if more than 1 pot
        potStacks = document.createElement('div'); 
        potStacks.setAttribute("class", 'potStacks'); 
        parent.appendChild(potStacks); 

        //sets id of potStacks
        if (i == 0){//mainPot
            potStacks.setAttribute("id", 'mainPot'); 
        }
        else{
            potStacks.setAttribute("id", 'pot' + i); 
        }

        for (let j = 0; j < currentPotDenoms.length; j++){//iterates through every denom in currentPot's denomArr 

            const currentDenomArr = currentPotDenoms[j];
            const currentDenomCount = currentDenomArr[1];
            for (let k = 0; k < currentDenomCount; k++){
                const chipDiv = document.createElement('div');
                const chipTopDiv = document.createElement('div');

                chipDiv.classList.add("chip");
                chipTopDiv.classList.add("chipTop");
                chipDiv.classList.add("chip" + currentDenomArr[0]);
                chipTopDiv.classList.add("chipTop" + currentDenomArr[0]);
                
                chipTopDiv.appendChild(document.createTextNode(getChipText(currentDenomArr[0])));
                chipDiv.appendChild(chipTopDiv);

                if(k == 0){//first chip               
                    denomStack = document.createElement('div');
                    denomStack.setAttribute("class", 'chipStack');                    
                    potStacks.appendChild(denomStack);
                    denomStack.appendChild(chipDiv);

                    chipDiv.style.position = "absolute";

                    const chipPos = chipDiv.getBoundingClientRect();

                    if (j != 0){
                        denomStack.style.position = "relative";
                        denomStack.style.left = ((chipPos.width) * j) + 'px';
                    }
                    
                    zIndex = 7000;
                    chipDiv.style.zIndex = zIndex;
                    zIndex++;                
                    if (j == 0){
                        chipDiv.style.top = ((320.2) - chipPos.top + 20 + (chipPos.top - 139.2)) + 'px'; //works for first chip of first denom
                    }
                    else{
                        chipDiv.style.top = (- 35) + 20 + 'px'; 
                    }           
                    chipDiv.style.left  = ((630-(((chipPos.width) * currentPotDenoms.length)/2))-chipPos.left+60) + 'px';
                }
                else{//position relative to previous chip of same denomStack
                    const lastChipPos = denomStack.lastChild.getBoundingClientRect();
                    denomStack.appendChild(chipDiv);

                    chipDiv.style.position = "absolute";

                    const chipPos = chipDiv.getBoundingClientRect();
                    const currentChipPos = denomStack.getBoundingClientRect();
                
                    chipDiv.style.zIndex = zIndex;
                    zIndex++;               


                    if (j == 0){
                        chipDiv.style.top = (180.8 + 16 + ((k - 1) * -4)) + "px";
                    }
                    else{
                        chipDiv.style.top = (lastChipPos.top - currentChipPos.bottom - 4) + "px";
                    }
                    chipDiv.style.left  = ((630 - (((chipPos.width) * currentPotDenoms.length)/2)) - chipPos.left + (chipPos.width*j) + 60) + 'px';
                }
            }
        }
    }
}

const buttonAngles = [
    //2-max
    [4.41, 1.27],
    //6-max
    [3.98, 2.51, 1.87, 0.63, 5.39, 5.01],
    //8-max
    [4.5, 3.4, 2.7, 1.78, 1.40, 0.44, 6.02, 4.84],
    //9-max
    [5.02, 4.08, 3.02, 2.54, 1.76, 1.42, 0.6, 6.4, 5.31],
    //10-max
    [4.98, 4.18, 3.23, 2.57, 2.10, 1.9, 1.13, 0.57, 6.24, 5.15]
];

function moveButton(seatIdx, previousIdx, tableSz, cashGameObj){    

    const idxSetCoordinates = idxOfCoordinates(tableSz);
    let currentAngle = buttonAngles[idxSetCoordinates][seatIdx];
    const previousAngle = buttonAngles[idxSetCoordinates][previousIdx];
    let angle = previousAngle;
    

    //sets current angle in case below x-axis when other isn't, now currentAngle always less than previousAngle
    if (currentAngle > previousAngle){
        currentAngle = parseFloat((currentAngle - 2*Math.PI).toFixed(2));
    }

    document.getElementById('button').style.position = "absolute";

    if(previousIdx == -1){
        const buttonX = 630 + 300 * Math.cos(currentAngle);
        const buttonY = -1*(-330 + 140 * Math.sin(currentAngle));
        document.getElementById('button').style.left = buttonX - 280 + 'px';
        document.getElementById('button').style.top = buttonY - 270 + 129.87 + 'px';
    }
    else{    
        setTimeout(function animation(){   
            if (angle > currentAngle){
                angle = parseFloat((angle - 0.01).toFixed(2));       
                const buttonX = 630 + 300 * Math.cos(angle);
                const buttonY = -1*(-330 + 140 * Math.sin(angle));
                document.getElementById('button').style.left = buttonX - 280 + 'px';
                document.getElementById('button').style.top = buttonY - 270 + 129.87 + 'px';
                setTimeout(animation, 1);
            }
            else if (angle == currentAngle){
                const buttonX = 630 + 300 * Math.cos(angle);
                const buttonY = -1*(-330 + 140 * Math.sin(angle));
                document.getElementById('button').style.left = buttonX - 280 + 'px';
                document.getElementById('button').style.top = buttonY - 270 + 129.87 + 'px';
                cashGameObj.btnAnimation = true;
                cashGameObj.button = cashGameObj.activePlayersIdx[0];
                let tempSeat = cashGameObj.activePlayersIdx[0];
                cashGameObj.activePlayersIdx.splice(0,1);
                cashGameObj.activePlayersIdx.push(tempSeat);
                cashGameObj.startGame();
            }
        }, 1);   
    } 
}

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
const betChipsAllSizes = [//do plus/minus 70 for first array value
    //2-max
    [["700px", "423.2px"] ,["560px", "178px"]],
    //6-max
    [["354.53282px", "414.2px"], ["354.53282px", "227px"], ["700px", "178px"], ["905.46718px", "227px"], ["905.46718px", "414.2px"], ["560px", "423.2px"]],
    //8-max
    [["552.15625px", "413.956px"], ["326.4375px", "391.556px"], ["326.4375px", "245.231px"], ["552.15625px", "187.244px"], ["707.84375px","187.244px"], ["933.5688px", "245.231px"], ["933.5688px", "391.556px"], ["707.84375px", "413.956px"]],
    //9-max
    [["560px", "423.2px"], ["410.625px", "402.981px"],["320.681px", "328.569px"], ["384.537px", "224.794px"], ["554.044px", "185.281px"], ["705.963px", "185.281px"], ["875.469px", "224.794px"], ["939.325px", "328.569px"], ["849.381px", "402.981px"]],
    //10-max
    [["560px","423.2px"], ["458.938px", "407.756px"], ["351.550px", "360.825px"], ["351.550px", "239.175px"], ["458.938px", "202.244px"], ["560px", "178px"], ["801.069px", "202.244px"], ["908.456px", "239.175px"], ["908.456px", "360.825px"] , ["801.069px", "407.756px"]]
];
const chipAmountStrArr = ["250M", "100M", "25M", "5M", "1M", "500K", "100K", "25K", "5K", "1K", "500", "100", "25", "5", "1", "25cent", "5cent", "1cent"];


module.exports = {
    idxOfCoordinates: idxOfCoordinates,
    bestHandsOutput: bestHandsOutput,
    bestActionOutput: bestActionOutput,
    displayArrChips: displayArrChips,
    betTextOutput: betTextOutput,
    displayPotChips: displayPotChips,
    moveButton: moveButton
}