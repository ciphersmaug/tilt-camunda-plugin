import { is } from 'bpmn-js/lib/util/ModelUtil';
import { ListGroup} from '@bpmn-io/properties-panel';
import { getBusinessObject } from 'bpmn-js/lib/util/ModelUtil';
import { getXMLTiltMetaProperties } from '../extensions-helper';

import {
  TiltMetaNameField,
  TiltMetaCreatedField,
  TiltMetaModifiedField,
  TiltMetaVersionField,
  TiltMetaLanguageField,
  TiltMetaStatusField,
  TiltMetaURLField
} from '../fields/meta'

export function createTiltMetaGroup(element, injector){
  const processBo = getProcessBo(element);
  const properties = getTiltMetaProperties(processBo);
  const metaGroup = {
    id: "meta-specification-group",
    label: "TILT elements",
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

  console.log(tiltMetaProperties)
  if (!tiltMetaProperties) {
    return [];
  }
  return tiltMetaProperties;
}