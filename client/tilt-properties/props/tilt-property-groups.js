import { is } from 'bpmn-js/lib/util/ModelUtil';
import { ListGroup} from '@bpmn-io/properties-panel';
import { getBusinessObject } from 'bpmn-js/lib/util/ModelUtil';
import { 
  getXMLTiltMetaProperties, 
  getExtensionElements,
  createExtensionElements,
  createCamundaProperties,
  getCamundaProperties,
  createTiltMetaProperty
} from '../extensions-helper';

import {
  createMetaProperty
} from '../tilt-io-helper'

import {
  TiltMetaNameField,
  TiltMetaCreatedField,
  TiltMetaModifiedField,
  TiltMetaVersionField,
  TiltMetaLanguageField,
  TiltMetaStatusField,
  TiltMetaURLField
} from '../fields/meta'
import { add } from 'diagram-js/lib/util/Collections';

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
function removeFactory(element, property, modeling) {
  return function(event) {
    event.stopPropagation();

    const businessObject = getBusinessObject(element);

    const tiltMetaProperty = getTiltMetaProperty(businessObject);

    modeling.updateModdleProperties(element, tiltMetaProperty, {
      values: camundaProperties.get('values').filter(value => value !== property)
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
      {
        id: "tilt-meta-list",
        label: "Meta information",
        entries: [
          {
            id: "meta-name",
            component: TiltMetaNameField,
            properties: properties,
            element
          },
          {
            id: "meta-created",
            component: TiltMetaCreatedField,
            properties: properties,
            element
          },
          {
            id: "meta-modified",
            component: TiltMetaModifiedField,
            properties: properties,
            element
          },
          {
            id: "meta-version",
            component: TiltMetaVersionField,
            properties: properties,
            element
          },
          {
            id: "meta-language",
            component: TiltMetaLanguageField,
            properties: properties,
            element
          },
          {
            id: "meta-status",
            component: TiltMetaStatusField,
            properties: properties,
            element
          },
          {
            id: "meta-url",
            component: TiltMetaURLField,
            properties: properties,
            element
          }
        ]
      }
    ]
  }
  return metaGroup
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