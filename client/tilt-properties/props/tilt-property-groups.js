import { ListGroup} from '@bpmn-io/properties-panel';
import { getBusinessObject } from 'bpmn-js/lib/util/ModelUtil';
import { useService } from 'bpmn-js-properties-panel';
import { TextFieldEntry, CheckboxEntry } from '@bpmn-io/properties-panel';
import { 
  findExtensions,
  createElement,
  removeDollarProperties,
  updateTiltProperty
} from '../io-extension-helper';

import { createMetaPropertyGroup } from './meta';
import { createControllerPropertyGroup } from './controller';
import { createRepresentativePropertyGroup } from './representative';
import { createDPOPropertyGroup } from './data-protection-officer';
import { createDataDisclosedPropertyGroup } from './data-disclosed';

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
    if (!extensionElements && !property_blueprint.parent_element) {
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
      case 'tilt:DataProtectionOfficer':
        items_list.push(createDPOPropertyGroup(...args));
        break;
      case 'tilt:DataDisclosed':
        items_list.push(createDataDisclosedPropertyGroup(...args));
        break;
      default:
        console.log(`Cannot create group ${extensions[i].$type}.`);
        break;
    }  
  }
  return [items_list, field_counter];
}

export function createTiltPropertiesGroup(element, injector, blueprint_array = [], max_extensions_to_create = [1]){
  var existing_groups = createExistingPropertyGroupsList(element, injector)
  var items_list = existing_groups[0], field_counter = existing_groups[1]
  //debugger;
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

export function createCheckBox(props){
  const {
    id,
    element,
    properties,
    type_name,
    type_label,
    type_description,
  } = props;

  const modeling = useService('modeling');

  const setValue = (value) => {
    var newPropertyObject = {};
    newPropertyObject[type_name] = value || false;
    updateTiltProperty(element, properties, newPropertyObject, modeling);
  };

  const getValue = () => {
    return properties[type_name] || false;
  };

  return CheckboxEntry({
    element:properties,
    id,
    description: type_description,
    label: type_label,
    getValue,
    setValue
  })

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