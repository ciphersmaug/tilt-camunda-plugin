const {getTiltFromElementIfExists, tiltMustExistOnlyOnce} = require("../tilt-rule-helper");

module.exports = function() {
    function check(node, reporter) {
        let check_passed  = false;
        let tilt_type = "tilt:Meta";
        if (getTiltFromElementIfExists(node, tilt_type)) {
            check_passed = tiltMustExistOnlyOnce(tilt_type)
            if(!check_passed){
                reporter.report(node.id, `[ TILT ]\t ${tilt_type} must exist only once.`);
            }
        }
    }
  
    return {
      check: check
    };
};