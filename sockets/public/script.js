console.log("algo");
var socket = io.connect("http://localhost:3004", { forceNew: true });

socket.on("messages", function (data) {
  console.log(data);
})
