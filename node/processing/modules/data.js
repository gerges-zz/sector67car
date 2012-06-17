// motorConroller data plugin for powerserver
// ========
var map_range = function(value, low1, high1, low2, high2) {
    return low2 + (high2 - low2) * (value - low1) / (high1 - low1);
};

var directionCode = {
	'0': "Reverse",
	'1': "Forward"
};

var dataProcessor = function(direction, throttle, dutyCycle) {
	var throttlePercent = map_range(throttle, 0, 255, 0, 100);
	var dutyCyclePercent = map_range(dutyCycle, 0, 255, 0, 100);
	console.log(dutyCycle);
	return {direction: directionCode[direction],
		 	throttle: parseFloat(throttlePercent),
			dutyCycle: parseFloat(dutyCyclePercent)}
};

module.exports = {
  name: "Data",
  code: "data",
  processor: dataProcessor
};
