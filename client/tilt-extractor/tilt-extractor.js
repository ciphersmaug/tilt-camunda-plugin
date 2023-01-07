function TiltExtractor(eventBus, bpmnRules, editorActions, canvas, commandStack) {
  //this.commandStack = commandStack;

  editorActions.register({
    extractTiltFromBpmn: function() {
      //this.extract();
      console.log("Hello")
    }
  });
}

TiltExtractor.prototype.extract = function() {
  console.log("Im extracting TILT")
};

TiltExtractor.$inject = [ 'eventBus', 'bpmnRules', 'editorActions', 'canvas', 'commandStack' ];
module.exports = {
  __init__: [ 'tiltExtractor' ],
  tiltExtractor: [ 'type', TiltExtractor ]
};