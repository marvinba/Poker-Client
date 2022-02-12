const electron = require('electron');
const {ipcRenderer} = electron;
const cashGameTbl = require('./table.js');
let username = cashGameTbl.username;
module.exports.passedUsername = username;


console.log(username);