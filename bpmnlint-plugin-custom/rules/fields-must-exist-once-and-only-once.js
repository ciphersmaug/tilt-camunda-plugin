const {getTiltFromElementIfExists, tiltMustExistOnlyOnce} = require("../tilt-rule-helper");
const tiltToExistOnce = [
    "tilt:Controller",
    "tilt:DataProtectionOfficer",
    "tilt:Meta",
    "tilt:AccessAndDataPortability",
    "tilt:RightToInformation",
    "tilt:RightToRectificationOrDeletion",
    "tilt:RightToDataPortability",
    "tilt:RightToWithdrawConsent",
    "tilt:RightToComplain",
    "tilt:ChangesOfPurpose"
    ]

module.exports = function() {
    function check(node, reporter) {
        let check_passed  = false;
        for(let x in tiltToExistOnce){
            if (getTiltFromElementIfExists(node, tiltToExistOnce[x])) {
                check_passed = tiltMustExistOnlyOnce(tiltToExistOnce[x])
                if(!check_passed){
                    reporter.report(node.id, `[ TILT ]\t ${tiltToExistOnce[x]} must exist only once.`);
                }
            }
        }
    }
  
    return {
      check: check
    };
};