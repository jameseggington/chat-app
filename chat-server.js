/*
 * Simple server for synching messages between connected clients
 */
var WSSConstructor = require("uws").Server;
var connect = require("connect");
var serveStatic = require("serve-static");
var wss = new WSSConstructor({
  port: 3000
});

connect().use(serveStatic(__dirname)).listen(8080, function() {
  console.log("http server running on 8080");
});
var messages = [],
  sockets = [];
wss.on("connection", function(ws) {
  sockets.push(ws);
  ws.send(JSON.stringify({
    currentTime: Date.now(),
    messages: messages
  }));
  ws.on("message", function(messageData) {
    var message;
    try {
    message = JSON.parse(messageData);
    } catch(e) {
      console.log(e);
      return;
    }
    if(!message) {
      return;
    }
    message.time = Date.now();
    messages.push(message);
    broadcast(sockets, JSON.stringify({
      currentTime: Date.now(),
      messages: messages
    }));
  });
});

function broadcast(sockets, message) {
  sockets.forEach(function(socket) {
    socket.send(message);
  });
}
