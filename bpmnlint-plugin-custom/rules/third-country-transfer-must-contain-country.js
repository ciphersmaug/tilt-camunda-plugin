const {test_if_properties_exists, getTiltFromElementIfExists} = require("../tilt-rule-helper");
const {
    is
  } = require('bpmnlint-utils');
  
/**
  * Rule that reports manual tasks being used.
  */

module.exports = function() {
    function check(node, reporter) {
        let check_passed  = false;
        let tilt_type = "tilt:ThirdCountryTransfers";
        let propertiesToTest = ["country"];
        if (getTiltFromElementIfExists(node, tilt_type)) {
            check_passed = test_if_properties_exists(node,tilt_type,propertiesToTest)
            if(!check_passed){
                reporter.report(node.id, `[ TILT ]\t ${tilt_type} must contain these fields: ${propertiesToTest}`);
            }
        }
    }
  
    return {
      check: check
    };
};