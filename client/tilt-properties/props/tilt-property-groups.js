import { is } from 'bpmn-js/lib/util/ModelUtil';
import { ListGroup} from '@bpmn-io/properties-panel';
import { getBusinessObject } from 'bpmn-js/lib/util/ModelUtil';
import { useService } from 'bpmn-js-properties-panel';
import { TextFieldEntry } from '@bpmn-io/properties-panel';
import { 
  getXMLTiltMetaProperties, 
  getExtensionElements,
  createExtensionElements,
  createTiltMetaProperty
} from '../extensions-helper';
import { createMetaPropertyGroup } from './meta-property-group';
import {
  updateTiltMetaProperty
} from '../tilt-io-helper';

function addMetaFactory(element, injector) {
  const bpmnFactory = injector.get('bpmnFactory'),
        modeling = injector.get('modeling');

  function add(event) {
    event.stopPropagation();

    const businessObject = getBusinessObject(element);

    const extensionElements = getExtensionElements(element),
          tiltMetaProperties = getXMLTiltMetaProperties(businessObject);

    let updatedBusinessObject, update;

    if (!extensionElements) {
      updatedBusinessObject = businessObject;

      const extensionElements = createExtensionElements(businessObject, bpmnFactory),
            tiltMetaProperties = createTiltMetaProperty(extensionElements, bpmnFactory, {});
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
    console.log(property)
    debugger;
    const businessObject = getBusinessObject(element);

    //const tiltMetaProperty = getTiltMetaProperties(businessObject);
    const extensionElements = getExtensionElements(businessObject);

    modeling.updateModdleProperties(element, extensionElements, {
      values: extensionElements.get('values').filter(value => value !== property)
    });
  };
}



export function createTiltMetaGroup(element, injector){
  const processBo = getProcessBo(element);
  const properties = getTiltMetaProperties(processBo);
  var addButton = null;
  if(properties.length==0){
    addButton = addMetaFactory(element, injector)
  };

  const metaGroup = {
    id: "meta-specification-group",
    label: "TILT elements",
    add:addButton,
    component: ListGroup,
    items: [
      createMetaPropertyGroup(properties,element,injector)
    ]
  }
  return metaGroup
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
    updateTiltMetaProperty(element, properties, newPropertyObject, modeling);
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