const { getBusinessObject } = require('bpmn-js/lib/util/ModelUtil');
// const {fs} = require("fs")
//const { dialog } = require('electron')

function TiltExtractor(eventBus, bpmnRules, editorActions, canvas, commandStack, elementRegistry, modeling, config) {
  //this.commandStack = commandStack;
  this.config = config;
  this.editorActions = editorActions;
  this.modeling = modeling;
  var self = this;
  this.canvas = canvas;
  
  editorActions.register({
    extractTiltFromBpmn: function() {
      let bo = getBusinessObject(canvas.getRootElement())
      self.extract();
    }
  });
}

TiltExtractor.prototype.getTiltElements = function(element = null) {
  if(!element){
    element = getBusinessObject(this.canvas.getRootElement());
  }
  var element_properties = [];
  var tilt_properties = [];

  if(element instanceof Object && !(element instanceof Array || element instanceof Function)){
    element_properties = Object.getOwnPropertyNames(element);
    element_properties = element_properties.filter(e =>
      !e.startsWith("$") &&
      !['di','messageFlows','sourceRef','targetRef','incoming','outgoing','flowNodeRef'].includes(e))

  }else if(Array.isArray(element)){
    for(let i in element){
      tilt_properties.push(...this.getTiltElements(element[i]));
    }
    return tilt_properties;

  }else{
    return tilt_properties;

  }

  if(element.hasOwnProperty("$type") && element.$type.startsWith("tilt")){
    tilt_properties.push(element);
    console.log(element)
    return tilt_properties;

  }
  
  for(let p in element_properties){

    if(element[element_properties[p]] instanceof Object && typeof(element[element_properties[p]]) != "string"){
      tilt_properties.push(...this.getTiltElements(element[element_properties[p]]));

    }
  }
  return tilt_properties;
};

TiltExtractor.prototype.extract = function() {
  tilt_object = {}
  var tilt_elements = this.getTiltElements();
  
  debugger;
  //var savepath = await window.showSaveFilePicker()
  //dialog.showOpenDialog({ properties: ['openFile', 'multiSelections'] });
};

TiltExtractor.$inject = [ 'eventBus', 'bpmnRules', 'editorActions', 'canvas', 'commandStack', 'elementRegistry', 'modeling','config'];
module.exports = {
  __init__: [ 'tiltExtractor' ],
  tiltExtractor: [ 'type', TiltExtractor ]
};