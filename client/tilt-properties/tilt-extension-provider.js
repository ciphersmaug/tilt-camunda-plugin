import {
  is,
  getBusinessObject
} from 'bpmn-js/lib/util/ModelUtil';

import {
  createTiltMetaGroup
} from './props/tilt-property-groups';



/**
 * An extension that makes process IO mappings configurable via a new
 * properties tab.
 *
 * @param {didi.Injector} injector
 */
export default class TiltPropertiesExtensionProvider {
  constructor(propertiesPanel, injector) {
    this._injector = injector;
    propertiesPanel.registerProvider(this);
  }

  getGroups(element) {
    return groups => {

      groups = groups.slice();
      groups.push(createTiltMetaGroup(element,this._injector));
      return groups;
    }
  }
}

TiltPropertiesExtensionProvider.$inject = [
  'propertiesPanel',
  'injector'
];


function getProcessRef(element) {
  const bo = getBusinessObject(element);

  return bo.processRef;
}
