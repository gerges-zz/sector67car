// voltage plugin for powerserver
// ========
var voltageProcessor = function(sensorNumber, reportedValue) {
	return {sensorName: sensorNumber,
			voltage: parseFloat(reportedValue),
			scale: 'Volts' }
};

module.exports = {
  name: "Volts",
  code: "volts",
  processor: voltageProcessor
};
