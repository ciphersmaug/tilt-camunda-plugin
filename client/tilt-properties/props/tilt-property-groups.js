import { ListGroup} from '@bpmn-io/properties-panel';
import { getBusinessObject } from 'bpmn-js/lib/util/ModelUtil';
import { useService } from 'bpmn-js-properties-panel';
import { TextFieldEntry, CheckboxEntry , NumberFieldEntry} from '@bpmn-io/properties-panel';
import { 
  findExtensions,
  createElement,
  removeDollarProperties,
  updateTiltProperty
} from '../io-extension-helper';

import { createDataDisclosedPropertyGroup } from './data-disclosed';
import TILT from "../../descriptors/tilt.json"
import { createPropertyGroup, createPropertyGroupFromModdle } from './moddle-property-io';

export function addFactory(element, injector, blueprint_array = []){
  const bpmnFactory = injector.get('bpmnFactory'),
        modeling = injector.get('modeling');
  
  function add(event = null, property_blueprint = null) {
    if(event != null){
      event.stopPropagation();
    }
    if(!property_blueprint){
      for(let e in blueprint_array){
        add(event,blueprint_array[e])
      }
      return;
    }
    
    var businessObject = getBusinessObject(element);
    var extensionElements = businessObject.get('extensionElements');
    let newElement;
    debugger;
    if ((!extensionElements && !property_blueprint.parent_element) || (!extensionElements && property_blueprint.parent_element != null && !property_blueprint.parent_element.$type.startsWith("bpmn"))) {
      // Ensure that the ExtensionElements Property exists if it is not attached to a parent
      extensionElements =  createElement('bpmn:ExtensionElements', {values : []}, businessObject, bpmnFactory);
      modeling.updateModdleProperties(element,businessObject,{ extensionElements });
      console.log(`TILT: Added ${extensionElements.$type} to ${element.id}`);
      return add(event,property_blueprint);
    }else if(extensionElements && !property_blueprint.parent_element){
      // Append a new Element to the extensionElement
      newElement = createElement(property_blueprint.tilt_type,property_blueprint.initialization_properties,businessObject, bpmnFactory);
      extensionElements.values.push(newElement);
      modeling.updateModdleProperties(element,businessObject,{ extensionElements });
      console.log(`TILT: Added ${newElement.$type} to ${element.id}`);
    }else{
      // Append a new Element to a parent Element.
      newElement = createElement(property_blueprint.tilt_type,property_blueprint.initialization_properties,property_blueprint.parent_element, bpmnFactory);
      if(!property_blueprint.parent_element.hasOwnProperty(property_blueprint.property_name)){
        property_blueprint.parent_element[property_blueprint.property_name] = [];
      }
      let update = { [property_blueprint.property_name]: property_blueprint.parent_element.get(property_blueprint.property_name).concat(newElement) }
      modeling.updateModdleProperties(element,property_blueprint.parent_element, update);
      console.log(`TILT: Added ${newElement.$type} to ${element.id}`);
    }
  }

  return add;
}

export function removeFactory(element, property, modeling) {
  return function(event) {
    event.stopPropagation();
    const extensionElements = getBusinessObject(element).get('extensionElements');

    if(property.$parent.$type == "bpmn:ExtensionElements" || property.$parent.hasOwnProperty("extensionElements")){
      modeling.updateModdleProperties(element, extensionElements, {
        values: extensionElements.get('values').filter(value => value !== property)
      });

    }else{
      debugger;
      let update = {};
      let property_name = property.$type.split(":")[1];
      property_name = property_name.charAt(0).toLowerCase() + property_name.slice(1);
      update[property_name] = property.$parent.get(property_name).filter(i => i !== property)
      modeling.updateModdleProperties(element, property.$parent, update )
    }
    
    
    if (extensionElements.values.length == 0){
      var updated_bo = getBusinessObject(element)
      delete updated_bo.extensionElements;
      updated_bo = removeDollarProperties(updated_bo)
      modeling.updateModdleProperties(element,getBusinessObject(element),updated_bo)
    }
  };
}

function createExistingPropertyGroupsList(element, injector){
  const extensions = findExtensions(element,null);
  var items_list = [];
  var field_counter = {};
  var args;
  var property_name_to_add;

  for (let i = 0; i < extensions.length; i++) {
    property_name_to_add = extensions[i].$type.split(":")[1];
    property_name_to_add = property_name_to_add.charAt(0).toLowerCase() + property_name_to_add.slice(1);

    //property_name_to_add = extensions[i].$type.split(":")[1].toLowerCase();
    if(!field_counter.hasOwnProperty(property_name_to_add)){
      field_counter[property_name_to_add] = 0;
    }

    args = [extensions[i].$type, element, injector, TILT ,extensions[i], ++field_counter[property_name_to_add]];
    items_list.push(createPropertyGroupFromModdle(...args));
  }
  return [items_list, field_counter];
}

export function createTiltPropertiesGroup(element, injector, blueprint_array = [], max_extensions_to_create = [1]){
  var existing_groups = createExistingPropertyGroupsList(element, injector)
  var items_list = existing_groups[0], field_counter = existing_groups[1]
  // return nothing if there are no tilt Elements to create and if there is no tilt Element to add:
  if (items_list.length == 0 && blueprint_array.length == 0){
    return null
  }

  var addButton = null;
  var addArray = []
  for (let i = 0; i < blueprint_array.length; i++) {
    if (field_counter.hasOwnProperty(blueprint_array[i].property_name)){
      if(field_counter[blueprint_array[i].property_name] < max_extensions_to_create[i]){
        addArray.push(blueprint_array[i]);
      }
    }else if(blueprint_array.length !=0 ){
      addArray.push(blueprint_array[i])
      field_counter[blueprint_array[i].property_name] = 1
    }
  }
  if (addArray.length != 0){
    addButton = addFactory(element, injector, addArray);
  }
  
  const tiltGroup = {
    id: `tilt-specification-group-${element.id}`,
    label: "TILT elements",
    add: addButton,
    component: ListGroup,
    items: items_list
  }
  return tiltGroup
}

export function createNumberField(props){
  const {
    id,
    element,
    properties,
    name,
    label,
    description,
    regex,
    errMsg
  } = props;

  const modeling = useService('modeling');
  const debounce = useService('debounceInput');

  const setValue = (value) => {
    var newPropertyObject = {};
    newPropertyObject[name] = value || '';
    updateTiltProperty(element, properties, newPropertyObject, modeling);
  };

  const getValue = () => {
    return properties[name] || "";
  };

  return NumberFieldEntry({
    element: properties,
    id,
    label,
    description,
    getValue,
    setValue,
    debounce
  });
}

export function createCheckBox(props){
  const {
    id,
    element,
    properties,
    name,
    label,
    description,
  } = props;

  const modeling = useService('modeling');

  const setValue = (value) => {
    var newPropertyObject = {};
    newPropertyObject[name] = value || false;
    updateTiltProperty(element, properties, newPropertyObject, modeling);
  };

  const getValue = () => {
    return properties[name] || false;
  };

  return CheckboxEntry({
    element:properties,
    id,
    description: description,
    label: label,
    getValue,
    setValue
  })

}

export function createTextField(props){
  const {
    id,
    element,
    properties,
    name,
    label,
    description,
    regex,
    errMsg
  } = props;

  const modeling = useService('modeling');
  const translate = useService('translate');
  const debounce = useService('debounceInput');

  const setValue = (value) => {
    var newPropertyObject = {};
    newPropertyObject[name] = value || '';
    updateTiltProperty(element, properties, newPropertyObject, modeling);
  };

  const getValue = () => {
    return properties[name] || "";
  };

  const validate = (value) => {
    if (!regex.test(value)) {
      return translate(errMsg);
    }
  };

  return TextFieldEntry({
    element: properties,
    id,
    label,
    description,
    getValue,
    setValue,
    debounce,
    validate
  });
}