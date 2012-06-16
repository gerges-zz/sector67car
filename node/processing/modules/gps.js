// gps plugin for powerserver
// ========
var gpsProcessor = function(lat, lng, alt, speedInKnots) {
	var speedInMph = speedInKnots * 1.15077945;
	return {latitude: parseFloat(lat),
		 	longitude: parseFloat(lng),
			alt: parseFloat(alt),
			speed: speedInMph};
};

module.exports = {
  name: "GPS",
  code: "gps",
  processor: gpsProcessor
};
