const {test_if_properties_exists } = require("../tilt-rule-helper");
const {
    is
  } = require('bpmnlint-utils');
  
/**
  * Rule that reports manual tasks being used.
  */

module.exports = function() {
    function check(node, reporter) {
        let check_passed  = false;
        let tilt_type = "tilt:Meta";
        let propertiesToTest = ["name", "created", "modified","version","language","status","url"];
        if (is(node, 'bpmn:Process')) {
            check_passed = test_if_properties_exists(node,tilt_type,propertiesToTest)
            if(!check_passed){
                reporter.report(node.id, "[ TILT ]\tThe business process needs to contain all required TILT meta fields.");
            }
        }
    }
  
    return {
      check: check
    };
};