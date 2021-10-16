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
  const potentiometerDireccion = new Sensor("A3");

  potentiometerDireccion.on("change", () => {
    const {value, raw} = potentiometerDireccion;
    let actual = value;
    if(actual % 10 == 0){
      if ( actual != anterior ){
        console.log(value);
        io.emit("direccion", {value: value, raw:raw});
        anterior = actual;
      }
    }
  });

  const potentiometerEscala = new Sensor("A4");

  potentiometerEscala.on("change", () => {
    const {value, raw} = potentiometerEscala;
    let actual = value;
    if(actual % 10 == 0){
      if ( actual != anterior ){
        console.log("Escala", value);
        io.emit("escala", {value: value, raw:raw});
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

