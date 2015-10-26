var Twitter = require('node-tweet-stream')
  , t = new Twitter({
    consumer_key: 'RhAzcuKQKSkVkKnbEBtsZWRFF',
    consumer_secret: 'nIg7TpT6pUBafjgJSbvB8x0Ncvn8YQnEcxdrxuGjNOkRTijkRN',
    token: '598846525-yj9YnPn70aXooTPIVRTrySWALuF7BgWWOQRNtBgh',
    token_secret: 'RO0arg9ZJvfZxk40JvuUXC9hvLNzh2fTsc2SXd2d7fInb'
  })

var AWS = require("aws-sdk");
var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var express = require('express')

var current_tracking = "pizza";

server.listen(3000);

//Setup routing for app
app.use(express.static(__dirname + '/public'));

//app.get('/', function (req, res) {
//  res.sendFile(__dirname + '/public/index.html');
//});

io.on('connection', function (socket) {

  socket.emit('news', { hello: 'world' });
  socket.on('my other event', function (data) {
    console.log(data);
  });

  t.on('tweet', function (tweet) {
  	//console.log('tweet received', tweet.text)
  	if(tweet.coordinates){
  	  if(tweet.coordinates!=null){
  	      var outputPoint = {"lat": tweet.coordinates.coordinates[0],"lng": tweet.coordinates.coordinates[1]};
  	      console.log(tweet.text+"  coordinates: "+outputPoint["lat"]+","+outputPoint["lng"])
	      socket.broadcast.emit("twitter-stream", outputPoint);

              //Send out to web sockets channel.
              socket.emit('twitter-stream', outputPoint);
  	  }
  	}
  })

  t.track(current_tracking)

  socket.on('test_event', function (data) {
    console.log(current_tracking);
    t.untrack(current_tracking)
    current_tracking = data['food']
    console.log(current_tracking);
    t.track(current_tracking)
  });

});

