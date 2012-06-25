var nano = require('nano')('http://localhost:5984');
var powerwheels = nano.use('powerwheels');

/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes');

var app = module.exports = express.createServer();
var io = require('socket.io').listen(app);

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
  // disable layout
  app.set("view options", {layout: false});

  // make a custom html template
  app.register('.html', {
    compile: function(str, options){
      return function(locals){
        return str;
      };
    }
  });
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

// Routes

app.get('/', function(req, res) {
    res.render('index.html');
});

app.listen(3000, function(){
  console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
});


var feed = powerwheels.follow({since:"now"});
feed.on("change", function(change) {
	//as long as item isn't a deletion, get it
	if(!change.deleted) {
		powerwheels.get(change.id, function(err, body) {
		  if (!err)
			console.log("emit: "+ body.dataType);
			io.sockets.emit(body.code, body);
		});
	}
});
feed.follow();