import React, { Fragment, PureComponent } from 'camunda-modeler-plugin-helpers/react';
import { Fill } from 'camunda-modeler-plugin-helpers/components';
const { getBusinessObject } = require('bpmn-js/lib/util/ModelUtil');
import { v4 as uuidv4 } from 'uuid';

import classNames from 'classnames';
import {getPropertyFromModdle } from '../tilt-properties/props/moddle-property-io';
import TILT from "../descriptors/tilt.json"

export default class ExtractButton extends PureComponent {
  constructor() {
    super();
    this._buttonRef = React.createRef();
  }

  getTiltElements(element = null) {
    // if(!element){
    //   element = getBusinessObject(canvas.getRootElement());
    // }
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
  
  getMeta(tilt_elements = []){
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

  createTiltObject(){
    debugger;
    var canvas = window.bpmnjsInjector.get("canvas");
    var rootElement = canvas.getRootElement();
    var tilt_object = {}
    var tilt_elements = getBusinessObject(this.getTiltElements(rootElement));
    tilt_object["meta"] = this.getMeta(tilt_elements);
    navigator.clipboard.writeText(tilt_object)

    alert("Copied the extracted TILT Document to the clipboard.")
    debugger;
  }

  createPropertyFromFile(){
    var moddle = TILT;
    debugger;
    var x = getPropertyFromModdle("tilt:Meta",moddle);
  }

  async saveFile(){
    const opts = {
      suggestedName: "NewProcessTiltDocument.tilt.json",
      types: [{
        description: 'TILT .json file',
        accept: {'application/json': ['.tilt.json']},
      }],
      excludeAcceptAllOption: true,
    };
        try {
          // Show the file save dialog.
          const handle = await window.showSaveFilePicker(opts);
          // Write to the file.
          const writable = await handle.createWritable();
          debugger;
          await writable.write("Hello World");
          await writable.close();
          return;
        } catch (err) {
          if (err.name !== 'AbortError') {
            alert(err.name +": "+ err.message);
            return;
          }
        }
  }


  render() {
    // we can use fills to hook React components into certain places of the UI
    return <Fragment>
      <Fill slot="status-bar__app" group="1_tilt_save">
        <button
          ref={ this._buttonRef }
          className={ classNames('tilt-btn','btn') }
          onClick={ () =>  this.createTiltObject()}>
          Click to create a TILT object...
        </button>
      </Fill>
    </Fragment>;onClick
  }
}

//ExtractButton.$inject = [
//  'eventBus',
//  'canvas',
//  'injector',
//  'viewer'
//];