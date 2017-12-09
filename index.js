var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var kafka = require("kafka-node");

var port = process.env.PORT || 80;

http.listen(port, function () {
  console.log('Server listening at port %d', port);
});

//Call SocketIO with the message from Kafka
function emit(io, message){
  io.sockets.emit("channel", message);
}

// Init the Kafka client. Basically just make topic the same topic as your producer and you are ready to go. group-id can be anything.
var kafkaConsumer = new kafka.ConsumerGroup({
      kafkaHost: process.env.KAFKA_HOST + ":" + process.env.KAFKA_PORT,
      groupId: "portfolio-emitter"
    }, [
      "portfolio-stats"
    ]);

kafkaConsumer.on('message', function (message) {
  console.log(message);
  emit(io, message);
});
