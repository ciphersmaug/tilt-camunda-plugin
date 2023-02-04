const { test_if_is_tilt } = require("../tilt-rule-helper");
const {
    is
  } = require('bpmnlint-utils');
  

module.exports = function() {
    function check(node, reporter) {
        let check_passed  = false;
        if (is(node, 'bpmn:MessageFlow')) {
            check_passed = !test_if_is_tilt(node,"tilt:ThirdCountryTransfers")
            if(!check_passed){
                reporter.report(node.id, "[ TILT ]\tThird country transfer detected!");
            }
        }
    }
  
    return {
      check: check
    };
};