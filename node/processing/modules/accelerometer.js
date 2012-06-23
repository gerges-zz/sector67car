// gps plugin for powerserver
// ========
var accelProcessor = function(x, y, z) {
	return {x: parseFloat(x),
		 	y: parseFloat(y),
			z: parseFloat(z)};
};

module.exports = {
  name: "Accelerometer",
  code: "accelerometer",
  processor: accelProcessor
};
