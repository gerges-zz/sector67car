// temperature plugin for powerserver
// ========
var sensorNames = {
	"1": "telemetry",
	"2": "leftMotor",
	"3": "rightMotor"
};

var tempProcessor = function(sensorNumber, reportedValue) {
	return {sensorName: sensorNames[sensorNumber],
			temperature: parseFloat(reportedValue),
			scale: 'Farenhiet' }
};

module.exports = {
  name: "Temperature",
  code: "temp",
  processor: tempProcessor
};
