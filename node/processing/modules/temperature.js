// temperature plugin for powerserver
// ========
var tempProcessor = function(sensorNumber, reportedValue) {
	return {sensorName: sensorNumber,
			temperature: parseFloat(reportedValue),
			scale: 'Farenhiet' }
};

module.exports = {
  name: "Temperature",
  code: "temp",
  processor: tempProcessor
};
