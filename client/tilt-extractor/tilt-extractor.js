const { getBusinessObject } = require('bpmn-js/lib/util/ModelUtil');
// const {fs} = require("fs")
//const { dialog } = require('electron')
function TiltExtractor(eventBus, bpmnRules, editorActions, canvas, commandStack, elementRegistry, modeling, config) {
  //this.commandStack = commandStack;
  this.config = config;
  this.editorActions = editorActions;
  this.modeling = modeling;
  debugger;
  var self = this;
  
  editorActions.register({
    extractTiltFromBpmn: function() {
      debugger;
      let bo = getBusinessObject(canvas.getRootElement())
      console.log(canvas)
      self.extract();
      //console.log("Hello")
    }
  });
}

TiltExtractor.prototype.extract = function() {
  console.log("Im extracting TILT");
  debugger;

  //var savepath = await window.showSaveFilePicker()
  //dialog.showOpenDialog({ properties: ['openFile', 'multiSelections'] });
};

TiltExtractor.$inject = [ 'eventBus', 'bpmnRules', 'editorActions', 'canvas', 'commandStack', 'elementRegistry', 'modeling','config'];
module.exports = {
  __init__: [ 'tiltExtractor' ],
  tiltExtractor: [ 'type', TiltExtractor ]
};