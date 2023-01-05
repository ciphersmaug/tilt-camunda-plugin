import { is } from 'bpmn-js/lib/util/ModelUtil';
import { ListGroup} from '@bpmn-io/properties-panel';
import { getBusinessObject } from 'bpmn-js/lib/util/ModelUtil';
import { useService } from 'bpmn-js-properties-panel';
import { TextFieldEntry } from '@bpmn-io/properties-panel';
import { 
  getXMLTiltMetaProperties,
  findExtensions,
  createExtensionElements,
  createTiltMetaProperty
} from '../extensions-helper';
import { createMetaPropertyGroup } from './meta-property-group';
import { createControllerPropertyGroup } from './controller-property-group';
import {
  updateTiltProperty
} from '../tilt-io-helper';
import { createElement } from '../extensions-helper';

function addFactory(tilt_type, element, injector){
  const bpmnFactory = injector.get('bpmnFactory'),
        modeling = injector.get('modeling');

  function add(event) {
    event.stopPropagation();

    const businessObject = getBusinessObject(element);

    const extensionElements = getBusinessObject(element).get('extensionElements'),
          tiltProperties = findExtensions(businessObject, tilt_type);
    
    debugger;

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

function addMetaFactory(element, injector) {
  const bpmnFactory = injector.get('bpmnFactory'),
        modeling = injector.get('modeling');

  function add(event) {
    event.stopPropagation();

    const businessObject = getBusinessObject(element);

    const extensionElements = getBusinessObject(element).get('extensionElements'),
          tiltMetaProperties = getXMLTiltMetaProperties(businessObject);

    let updatedBusinessObject, update;

    if (!extensionElements) {
      updatedBusinessObject = businessObject;

      const extensionElements = createExtensionElements(businessObject, bpmnFactory),
            tiltMetaProperties = createElement("tilt:Meta",{},extensionElements, bpmnFactory);
      extensionElements.values.push(tiltMetaProperties);

      update = { extensionElements };
    } else if (!tiltMetaProperties) {
      updatedBusinessObject = extensionElements;

      const tiltMetaProperties = createTiltMetaProperty(extensionElements, bpmnFactory, {});

      update = { values: extensionElements.get('values').concat(tiltMetaProperties) };
    }
    modeling.updateModdleProperties(element, updatedBusinessObject, update);
  }

  return add;
}

export function removeFactory(element, property, modeling) {

  return function(event) {
    event.stopPropagation();
    //console.log(property)
    //debugger;
    //const businessObject = getBusinessObject(element);
    const extensionElements = getBusinessObject(element).get('extensionElements');

    modeling.updateModdleProperties(element, extensionElements, {
      values: extensionElements.get('values').filter(value => value !== property)
    });
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
    id: "tilt-specification-group",
    label: "TILT elements",
    add:addButton,
    component: ListGroup,
    items: items_list
  }
  return tiltGroup
}

export function createTiltMetaGroup(element, injector){
  const processBo = getProcessBo(element);
  const properties = getTiltMetaProperties(processBo);
  var addButton = null;
  if(properties.length==0){
    addButton = addMetaFactory(element, injector)
  };

  const tiltGroup = {
    id: "tilt-specification-group",
    label: "TILT elements",
    add:addButton,
    component: ListGroup,
    items: [
      createMetaPropertyGroup(properties,element,injector)
    ]
  }
  return tiltGroup
}

export function createTiltControllerGroup(element, injector){
  const processBo = getProcessBo(element);
  const properties = findExtensions(processBo,"tilt:Controller");
  debugger;
  
  
  var addButton = null;
  if(properties.length==0){
    addButton = addFactory("tilt:Controller",element, injector)
  };

  const tiltGroup = {
    id: "tilt-specification-group",
    label: "TILT elements",
    add:addButton,
    component: ListGroup,
    items: [
      createControllerPropertyGroup(properties,element,injector)
    ]
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

  var tilt_type = id.split("-")[0];

  const modeling = useService('modeling');
  const translate = useService('translate');
  const debounce = useService('debounceInput');

  const setValue = (value) => {
    var newPropertyObject = {};
    newPropertyObject[type_name] = value || '';
    updateTiltProperty(element, properties, newPropertyObject, modeling, tilt_type);
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
 */
function getProcessBo(element) {
  const bo = getBusinessObject(element);

  if (is(element, 'bpmn:Participant')) {
    bo = bo.processRef;
  }

  return bo;
}

function getTiltMetaProperties(processBo){
  const tiltMetaProperties = getXMLTiltMetaProperties(processBo);
  if (!tiltMetaProperties) {
    return [];
  }
  return tiltMetaProperties;
}