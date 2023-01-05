import { ListGroup} from '@bpmn-io/properties-panel';
import { getBusinessObject } from 'bpmn-js/lib/util/ModelUtil';
import { useService } from 'bpmn-js-properties-panel';
import { TextFieldEntry } from '@bpmn-io/properties-panel';
import { 
  findExtensions,
  createExtensionElements,
  createElement,
  removeDollarProperties,
  updateTiltProperty
} from '../io-extension-helper';

import { createMetaPropertyGroup } from './meta-property-group';
import { createControllerPropertyGroup } from './controller-property-group';

function addFactory(tilt_type, element, injector){
  const bpmnFactory = injector.get('bpmnFactory'),
        modeling = injector.get('modeling');

  function add(event) {
    event.stopPropagation();

    const businessObject = getBusinessObject(element);

    const extensionElements = getBusinessObject(element).get('extensionElements'),
          tiltProperties = findExtensions(businessObject, tilt_type);

    let updatedBusinessObject, update;

    if (!extensionElements) {
      updatedBusinessObject = businessObject;

      const extensionElements = createExtensionElements(businessObject, bpmnFactory),
            tiltProperties = createElement(tilt_type,{},extensionElements, bpmnFactory);
      extensionElements.values.push(tiltProperties);

      update = { extensionElements };
    } else if (tiltProperties.length == 0) {
      updatedBusinessObject = extensionElements;

      const tiltProperties = createElement(tilt_type,{},extensionElements, bpmnFactory);

      update = { values: extensionElements.get('values').concat(tiltProperties) };
    }
    modeling.updateModdleProperties(element, updatedBusinessObject, update);
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

export function createTiltPropertiesGroup(element,injector,extension_type="tilt:Meta"){
  const extensions = findExtensions(element,null);
  var items_list = []
  let meta_fields = 0, controller_fields = 0
  for (let i = 0; i < extensions.length; i++) {
      if (extensions[i].$type == "tilt:Meta"){
        items_list.push(createMetaPropertyGroup(extensions[i], element, injector,++meta_fields ));
      }else if (extensions[i].$type == "tilt:Controller"){
        items_list.push(createControllerPropertyGroup(extensions[i],element,injector,++controller_fields));
      }
    }
  // Add Button for the tilt property Group 
  var addButton = null;
  if(extensions.length==0){
    addButton = addFactory(extension_type, element, injector)
  };

  const tiltGroup = {
    id: `tilt-specification-group-${element.id}`,
    label: "TILT elements",
    add:addButton,
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


// helper

/**
 * Get process business object from process element or participant.
 *
//function getProcessBo(element) {
//  const bo = getBusinessObject(element);
//
  if (is(element, 'bpmn:Participant')) {
    bo = bo.processRef;
  }

  return bo;
}
*/