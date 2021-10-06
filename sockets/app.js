const express = require('express');
const app = express();
const { Board, Sensor } = require("johnny-five");
const board = new Board();
const http = require('http');
const server = http.createServer(app);

let io = require("socket.io")(server, {
  cors: {
    origin: "http://localhost:3001",
    methods: ["GET", "POST"]
  }
});

let anterior = 0;
let actual;


app.use(express.static(__dirname + '/public'))
// app.use('/', express.static(path.join(__dirname, 'node_modules/socket.io')));

board.on("ready", () => {
  const potentiometer = new Sensor("A3");

  potentiometer.on("change", () => {
    const {value, raw} = potentiometer;
    let actual = value;
    if(actual % 10 == 0){
      if ( actual != anterior ){
        console.log(value);
        io.emit("messages", {value: value, raw:raw});
        anterior = actual;
      }
    }

  });
});


io.on('connection', (socket) => {
  console.log('Nuevo cliente conectado');
});


server.listen(3004, () => {
  console.log('listening on *:3004');
});

