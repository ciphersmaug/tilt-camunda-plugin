const { getBusinessObject } = require('bpmn-js/lib/util/ModelUtil');
// const {fs} = require("fs")
//const { dialog } = require('electron')
const tilt_descriptor = require("../descriptors/tilt.json");
//const { default: ExtractButton } = require('./extract-button');

function TiltExtractor(injector, eventBus, bpmnRules, editorActions, canvas, commandStack, elementRegistry, modeling, config) {
  //this.commandStack = commandStack;
  this.config = config;
  this.editorActions = editorActions;
  this.modeling = modeling;
  var self = this;
  this.canvas = canvas;
  window.bpmnjsInjector = injector;
  //new ExtractButton(eventBus,canvas).render();
  
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

function getPropertiesToCheck(){

}

function getMeta(tilt_elements = []){
  tilt_elements = tilt_elements.filter(e => e.$type == "tilt:Meta");
  var meta = {};
  var element_properties = tilt_descriptor.types.filter(e => e.name == "Meta")[0].properties
  var property_names = [];
  for(let i in element_properties){
    property_names.push(element_properties[i].name.split(":")[1]);
  }
  for(m in tilt_elements){
    for(p in property_names){
      if(tilt_elements[m].hasOwnProperty(property_names[p])){
        meta[property_names[p]] = tilt_elements[m][property_names[p]]
      }else{
        meta[property_names[p]] = null;
      }
    }
    
  }
  return meta
}

TiltExtractor.prototype.extract = function() {
  tilt_object = {}
  var tilt_elements = this.getTiltElements();
  tilt_object["meta"] = getMeta(tilt_elements);
  navigator.clipboard.writeText(tilt_object);
  alert(tilt_object);
  debugger;
  //var savepath = await window.showSaveFilePicker()
  //dialog.showOpenDialog({ properties: ['openFile', 'multiSelections'] });
};

TiltExtractor.$inject = [ 'injector' ,'eventBus', 'bpmnRules', 'editorActions', 'canvas', 'commandStack', 'elementRegistry', 'modeling','config'];
module.exports = {
  __init__: [ 'tiltExtractor' ],
  tiltExtractor: [ 'type', TiltExtractor ]
};