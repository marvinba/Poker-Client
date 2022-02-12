
const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');

const app = express();
const server = http.createServer(app);
//const io = socketio(server);

app.use(express.static("./"));

//app.get("/bareby", (req,res) =>{
  //  res.sendFile(path.join(__dirname, 'cashGameTable.html'))
//});
// Run when client connects
io.on('connection', socket => {
  console.log('connection made')

    // Runs when client disconnects
    socket.on('disconnect', () => {
    })
})

//works!!! delete later
//ipcRenderer.on('Create Cash Game info', (e,info)=>{
  //console.log('create in cashGameServer.js')
//});


const PORT = process.env.PORT || 5000;

server.listen(PORT, () =>{console.log('hi');});