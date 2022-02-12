function openNewCashWindow(){
    ipcRenderer.send('open: Create New Cash Game');
}
function openNewSnGWindow(){
    ipcRenderer.send('open: Create New SnG');
}
function openNewTournyWindow(){
    ipcRenderer.send('open: Create New Tournament');
}