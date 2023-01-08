const { getBusinessObject } = require('bpmn-js/lib/util/ModelUtil');
//const { dialog } = require('electron')
function TiltExtractor(eventBus, bpmnRules, editorActions, canvas, commandStack, elementRegistry, modeling, config) {
  //this.commandStack = commandStack;
  debugger;
  var self = this;
  
  editorActions.register({
    extractTiltFromBpmn: function() {
      let bo = getBusinessObject(canvas.getRootElement())
      console.log(canvas)
      self.extract();
      //console.log("Hello")
    }
  });
}

TiltExtractor.prototype.extract = async function() {
  console.log("Im extracting TILT");
  //var savepath = await window.showSaveFilePicker()
  //dialog.showOpenDialog({ properties: ['openFile', 'multiSelections'] });
};

TiltExtractor.$inject = [ 'eventBus', 'bpmnRules', 'editorActions', 'canvas', 'commandStack', 'elementRegistry', 'modeling','config'];
module.exports = {
  __init__: [ 'tiltExtractor' ],
  tiltExtractor: [ 'type', TiltExtractor ]
};