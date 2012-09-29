var Buffer = require('buffer').Buffer;
var dgram = require('dgram');
var mdns = require('mdns');
var clc = require('cli-color');
var _ = require('underscore');
var nano = require('nano')('http://localhost:5984');

var temp = require("./modules/temperature");
var gps = require("./modules/gps");
var data = require("./modules/data");
var fault = require("./modules/fault");
var voltage = require("./modules/voltage");
var accelerometer = require("./modules/accelerometer");

//Codes, and processors
var sourceCodes = {
	"P": "Paragon Motor Controller",
	"T": "Telemetry Board"
};

var dataProcessors = {
	"T": temp,
	"G": gps,
	"D": data,
	"F": fault,
	"V": voltage,
	"A": accelerometer
};

var logMessage = function () {
	console.log(msg("Service is up and recieving data"));
};

var announceMessage = _.throttle(logMessage, 30000);

var err = clc.red.bold;
var msg = clc.green.bold;
var msgNfo = clc.green;
var nfo = clc.yellow;
var port = 41234;

//Persist data with nano (to couchdb)
var powerwheels = nano.db.use('powerwheels');
var persistData = function (data) {
	//add/overide timestamp
	data.timestamp = new Date();
	powerwheels.insert(data, function(err, body, header) {
      if (err) {
        console.log('[powerwheels.insert] ', err.message);
        return;
      }
      console.log("connected");
    });
};

var processData = function (data) {
	var src = data.charAt(0);
	var funcCode = data.charAt(1);
	var dataStr = data.substring(3);
	
	var dataProcessor = dataProcessors[funcCode];
	var processor = dataProcessor.processor;
	
	var processedData = {};

	if(typeof processor == 'function'){
		argsArray = dataStr.split(" ");
		processedData = processor.apply(this, argsArray);
	}
	
	persistData({
		source: sourceCodes[src],
		dataType: dataProcessor.name,
		code: dataProcessor.code,
		data: processedData
	});
};

var processDatas = function(datas) {
	var dataArray = datas.split(', ');
	_.each(dataArray, function (data) {
		processData(data);
	});
};

// monitor serial port data
var browser = mdns.createBrowser(mdns.udp('telemetry'));
browser.on('serviceUp', function(service) {
  console.log(service);
  console.log(msg('Discovered telemetry service @' + service.host));

  console.log(nfo("Registering outgoing UDP socket on port " + port + "...."));
  var sock = dgram.createSocket("udp4");
  sock.bind(port);


  var buf = new Buffer("req");
  var requestData = function () {
   sock.send(buf, 0, buf.length, 8888, "169.254.86.154");
  };

  console.log(nfo("Registering incoming message handler...."));
  sock.on("message", function (data, rinfo) {
    announceMessage();
	//process any recieved data
	try {
		processDatas(data);
	} catch (error) {
		console.log(err("Unable to process message: " + data));
	}
  });

  sock.on("error", function (exception) {
    console.log(err(exception));
  });

  console.log(nfo("Requesting data..."));
  setInterval(requestData, 500);

});
browser.start();
