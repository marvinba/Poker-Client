class Pot{
    constructor(betAmt, allInBool = false){
        this.betAmount = betAmt;
        this.total = 0;
        this.initialPot = 0;
        this.allInBool = allInBool;
        this.allInsIdx = [];
    }
    changeBetAmt(newBetAmt){
        this.betAmount = newBetAmt;
    }
    addToPot(amountToAdd){//just regular call or bet/raise
        this.total = this.total + amountToAdd;
    }
    setTotal(totalAmount){
        this.total = totalAmount;
    }
    setAllIn(allInAmt, allInIdx){
        this.betAmount = allInAmt;
        this.allInBool = true;
        this.allInsIdx.push(allInIdx);
    }
    addAllIn(allInIdx){
        this.allInsIdx.push(allInIdx);
    }
}

module.exports = Pot;