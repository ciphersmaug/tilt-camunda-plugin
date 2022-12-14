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

function addMetaFactory(element, injector) {
  const bpmnFactory = injector.get('bpmnFactory'),
        modeling = injector.get('modeling');

  function add(event) {
    event.stopPropagation();

    const property = createMetaProperty(bpmnFactory, {
      name:""
    });

    const businessObject = getBusinessObject(element);

    const extensionElements = getExtensionElements(element),
          tiltMetaProperties = getXMLTiltMetaProperties(businessObject);

    let updatedBusinessObject, update;

    if (!extensionElements) {
      updatedBusinessObject = businessObject;

      const extensionElements = createExtensionElements(businessObject, bpmnFactory),
            tiltMetaProperties = createTiltMetaProperty(extensionElements, bpmnFactory, { values: [ property ] });
      extensionElements.values.push(tiltMetaProperties);
      //property.$parent = tiltMetaProperties;

      update = { extensionElements };
    } else if (!tiltMetaProperties) {
      updatedBusinessObject = extensionElements;

      const tiltMetaProperties = createTiltMetaProperty(extensionElements, bpmnFactory, { values: [ property ] });
      property.$parent = tiltMetaProperties;

      update = { values: extensionElements.get('values').concat(tiltMetaProperties) };
    } else {
      updatedBusinessObject = tiltMetaProperties;
      property.$parent = tiltMetaProperties;

      update = { values: tiltMetaProperties.get('values').concat(property) };
    }

    modeling.updateModdleProperties(element, updatedBusinessObject, update);
  }

  return add;
}




export function createTiltMetaGroup(element, injector){
  const bpmnFactory = injector.get('bpmnFactory');
  const modeling = injector.get('modeling');
  const extensionElements = getExtensionElements(element);
  let update;
  if(!extensionElements){
    
    //const newExtensionElement = createExtensionElements(getBusinessObject(element),bpmnFactory);
    //const metaProperty = createMetaProperty(bpmnFactory,{name:"Neuer Name"});//createTiltMetaProperty(extensionElements, bpmnFactory, getTiltMetaProperties(processBo))
    //newExtensionElement.values.push(metaProperty);
    //update = {newExtensionElement};
    //console.log(newExtensionElement);
    //modeling.updateModdleProperties(element, newExtensionElement, update);//,{extensionElements})
  }

  const processBo = getProcessBo(element);
  const properties = getTiltMetaProperties(processBo);
  const metaGroup = {
    id: "meta-specification-group",
    label: "TILT elements",
    add:addMetaFactory(element, injector),
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