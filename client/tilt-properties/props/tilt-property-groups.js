import { ListGroup} from '@bpmn-io/properties-panel';
import { getBusinessObject } from 'bpmn-js/lib/util/ModelUtil';
import { useService } from 'bpmn-js-properties-panel';
import { TextFieldEntry } from '@bpmn-io/properties-panel';
import { 
  findExtensions,
  createElement,
  removeDollarProperties,
  updateTiltProperty
} from '../io-extension-helper';

import { createMetaPropertyGroup } from './meta';
import { createControllerPropertyGroup } from './controller';
import { createRepresentativePropertyGroup } from './representative';4
import { createDPOPropertyGroup } from './data-protection-officer';

export function addFactory(element, injector, tilt_type, initializationProperties = {}, parentElement = null){
  const bpmnFactory = injector.get('bpmnFactory'),
        modeling = injector.get('modeling');
  
  function add(event = null) {
    if(event != null){
      event.stopPropagation();
    }
    
    var businessObject = getBusinessObject(element);
    var extensionElements = businessObject.get('extensionElements');
    let newElement;
    if (!extensionElements && !parentElement) {
      // Ensure that the ExtensionElements Property exists if it is not attached to a parent
      extensionElements =  createElement('bpmn:ExtensionElements', {values : []}, businessObject, bpmnFactory);
      modeling.updateModdleProperties(element,businessObject,{ extensionElements });
      console.log(`TILT: Added ${extensionElements.$type} to ${element.id}`);
      return add(event);
    }else if(extensionElements && !parentElement){
      // Append a new Element to the extensionElement
      newElement = createElement(tilt_type,initializationProperties,businessObject, bpmnFactory);
      extensionElements.values.push(newElement);
      modeling.updateModdleProperties(element,businessObject,{ extensionElements });
      console.log(`TILT: Added ${newElement.$type} to ${element.id}`);
    }else{
      var propertyNameToAdd = tilt_type.split(":")[1].toLowerCase()
      newElement = createElement(tilt_type,initializationProperties,parentElement, bpmnFactory);
      let update = { [propertyNameToAdd]: parentElement.get(propertyNameToAdd).concat(newElement) }
      modeling.updateModdleProperties(element,parentElement, update);
      console.log(`TILT: Added ${newElement.$type} to ${element.id}`);
    }
  }

  return add;
}

export function removeFactory(element, property, modeling) {
  return function(event) {
    event.stopPropagation();
    const extensionElements = getBusinessObject(element).get('extensionElements');

    modeling.updateModdleProperties(element, extensionElements, {
      values: extensionElements.get('values').filter(value => value !== property)
    });
    
    if (extensionElements.values.length == 0){
      var updated_bo = getBusinessObject(element)
      delete updated_bo.extensionElements;
      updated_bo = removeDollarProperties(updated_bo)
      modeling.updateModdleProperties(element,getBusinessObject(element),updated_bo)
    }
  };
}

export function createTiltPropertiesGroup(element, injector, extension_type="tilt:Meta", initializationProperties = {}){
  const extensions = findExtensions(element,null);
  var items_list = []
  var field_counter = {}
  var args;
  var property_name_to_add; 
  for (let i = 0; i < extensions.length; i++) {
    property_name_to_add = extensions[i].$type.split(":")[1]
    if(!field_counter.hasOwnProperty(property_name_to_add)){
      field_counter[property_name_to_add] = 0;
    }
    args = [extensions[i], element, injector, ++field_counter[property_name_to_add]];

    // This is a bit redundant but somewhere we need to make the function call.
    // Dynamic function creation is disabled in the electron environment
    switch (extensions[i].$type) {
      case 'tilt:Meta':
        items_list.push(createMetaPropertyGroup(...args));
        break;
      case 'tilt:Controller':
        items_list.push(createControllerPropertyGroup(...args));
        break;
      case 'tilt:Representative':
        items_list.push(createRepresentativePropertyGroup(...args));
        break;
      case 'tilt:DPO':
        items_list.push(createDPOPropertyGroup(...args));
        break;
      case 'tilt:DataDisclosed':
        items_list.push(createDataDisclosedPropertyGroup(...args));
        break;
      default:
        console.log(`Cannot create group ${extensions[i].$type}.`);
        debugger;
        break;
    }  
  }

  if (items_list.length == 0 && !extension_type){
    return null
  }

  var addButton = null;
  if (extension_type){
    addButton = addFactory(element, injector, extension_type, initializationProperties)
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

export function createTextField(props){
  const {
    id,
    element,
    properties,
    type_name,
    type_label,
    type_description,
    validation_regex,
    validation_text
  } = props;

  const modeling = useService('modeling');
  const translate = useService('translate');
  const debounce = useService('debounceInput');

  const setValue = (value) => {
    var newPropertyObject = {};
    newPropertyObject[type_name] = value || '';
    updateTiltProperty(element, properties, newPropertyObject, modeling);
  };

  const getValue = () => {
    return properties[type_name] || "";
  };

  const validate = (value) => {
    if (!validation_regex.test(value)) {
      return translate(validation_text);
    }
  };

  return TextFieldEntry({
    element: properties,
    id,
    label: type_label,
    description: type_description,
    getValue,
    setValue,
    debounce,
    validate
  });
}