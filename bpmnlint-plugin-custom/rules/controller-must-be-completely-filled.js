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
        let tilt_type = "tilt:Controller";
        let propertiesToTest = ["name"];
        if (is(node, 'bpmn:StartEvent')) {
            check_passed = test_if_properties_exists(node,tilt_type,propertiesToTest)
            if(!check_passed){
                reporter.report(node.id, "Must Contain all this and that...");
            }
        }
    }
  
    return {
      check: check
    };
};