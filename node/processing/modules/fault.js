// motor controller fault plugin for powerserver
// ========

var faultCodes = {
	0: "No Fault",
	1: "Short (Short to ground, short to supply, or shorted load)",
	2: "Driver Overtemperature Warning",
	3: "UnderVoltage (V5, VReg, or Bootstrap undervoltage)"
}

var faultProcessor = function(faultCode) {
	
	return {code: faultCode,
			message: faultCodes.faultCode}
};

module.exports = {
  name: "Fault",
  code: "fault",
  processor: faultProcessor
};
