function openCashier(){
    ipcRenderer.send('open: Cashier Window');
}

function openDepositWindow(){
    ipcRenderer.send('open: Deposit Window');
}
  
function logoutApp(){
    document.getElementById('cashierButton').style.visibility = none;
    document.getElementById('despoitButton').style.visibility = none;
    
    document.getElementById('logOutBtn').style.visibility = none;
  
    document.getElementById('loginBtn').style.visibility = float;  
    document.getElementById('createAccountBtn').style.visibility = float;
  
    document.getElementById('createNewCash').style.visibility = none;
    document.getElementById('createNewSnG').style.visibility = none;
    document.getElementById('createNewTournament').style.visibility = none;    
  
}