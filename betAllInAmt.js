class betAllInAmt{
    constructor(betAmount, allInBool = false){
        this.betAmount = betAmount;
        this.allInBool = allInBool;
        this.betCallCount = 1;
        this.overallCount = 1;
    }
    updateLowerAllIns(cashGameObj){//increments lower allIns by 1
        const initialIdx = cashGameObj.betAllInAmts.findIndex(bet => (bet.betAmount < this.betAmount));
        if (initialIdx != -1){
            for (let i = initialIdx; i < cashGameObj.betAllInAmts.length; i++){
                if(cashGameObj.betAllInAmts[i].allInBool){
                    cashGameObj.betAllInAmts[i].overallCount = cashGameObj.betAllInAmts[i].overallCount + 1;
                }
            }
        }
    }
    setOverallCount(cashGameObj){
        //overall is sum of all greater amounts + 1 if bet is allIn, otherwise same as betCallCount
        if (this.allInBool){
            let finalCount = 0;
            for (let i = 0; i < cashGameObj.betAllInAmts.length; i++){
                if(cashGameObj.betAllInAmts[i].betAmount > this.betAmount){
                    finalCount = finalCount + cashGameObj.betAllInAmts[i].betCallCount;
                }
                else{
                    break;
                }
            }
            this.overallCount = finalCount + 1;
        }
        else{
            this.overallCount = this.betCallCount;
        }
    }
    updateCount(cashGameObj){//updates current amount and lower allIns if necessary
        this.betCallCount = this.betCallCount + 1;
        this.overallCount = this.overallCount + 1;
        this.updateLowerAllIns(cashGameObj);
    }
    setAllIn(cashGameObj){//sets count 
        if (!this.allInBool){
            this.allInBool = true;
            this.setOverallCount(cashGameObj);
            this.overallCount = this.overallCount + this.betCallCount;
            this.betCallCount = this.betCallCount + 1;
            this.updateLowerAllIns(cashGameObj);
        }
        else{
            this.betCallCount = this.betCallCount + 1;
            this.overallCount = this.overallCount + 1;
            this.updateLowerAllIns(cashGameObj);
        }
    }
    deductFromCount(cashGameObj){
        this.betCallCount = this.betCallCount - 1;
        this.overallCount = this.overallCount - 1;

        if(this.overallCount == 0){
            //splice this betAllInAmt from array
            const idxToSplice = cashGameObj.betAllInAmts.findIndex(betAmountObj => betAmountObj.betAmount == this.betAmount);
            cashGameObj.betAllInAmts.splice(idxToSplice, 1);
        }
    }
}

module.exports = 
    betAllInAmt;
