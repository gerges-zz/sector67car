var serialport = require("serialport");
var nano = require('nano')('http://localhost:5984');

var temp = require("./modules/temperature");
var gps = require("./modules/gps");
var data = require("./modules/data");
var fault = require("./modules/fault");

//Codes, and processors

var sourceCodes = {
	"P": "Paragon Motor Controller",
	"T": "Telemetry Board"
};

var dataProcessors = {	
	"T": temp,
	"G": gps,
	"D": data,
	"F": fault
};

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
      console.log("powerwheels data logged" + data);
    });
}

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
}

// monitor serial port data
var SerialPort = serialport.SerialPort;
var sp = new SerialPort("/dev/tty.usbmodemfa141", {
	baudrate: 9600,
	parser: serialport.parsers.readline("\n")
});

//process any recieved data
sp.on("data", function (data) {
	data = data.toString();
    console.log("serial data: " + data);
	processData(data);
});


//generate test data
var myFunc = function () {
	var items = ['TT 1 120\n', 
	"TG 45.23 -89.1 22 5\n",
	"TG 45.23 -89.2 22 6\n",
	"TG 45.23 -89.3 22 10\n",
	"TG 45.23 -89.4 22 15\n"]
	sp.write(items[Math.floor(Math.random()*items.length)]);
}
setInterval(myFunc, 3000);