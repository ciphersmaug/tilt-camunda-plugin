import {
  is,
  getBusinessObject
} from 'bpmn-js/lib/util/ModelUtil';

import {
  createTiltPropertiesGroup
} from './props/tilt-property-groups';



/**
 * An extension that makes  tilt properties configurable via a new
 * properties tab.
 *
 */
export default class TiltPropertiesExtensionProvider {
  constructor(propertiesPanel, injector) {
    this._injector = injector;
    propertiesPanel.registerProvider(this);
  }

  getGroups(element) {
    return groups => {

      groups = groups.slice();
      if(is(element, 'bpmn:Process')) {
        groups.push(createTiltPropertiesGroup(element,this._injector,"tilt:Meta"));
      }else if(is(element, 'bpmn:StartEvent')) {
        groups.push(createTiltPropertiesGroup(element,this._injector,"tilt:Controller",{representative:[]}));
      }else if(is(element, 'bpmn:Process')) {
        groups.push(createTiltPropertiesGroup(element,this._injector,"tilt:DPO",{}));
      }else{
        var newGroup = createTiltPropertiesGroup(element,this._injector,null,null)
        if (newGroup){
          groups.push(newGroup)
        }
      }

      return groups;
    }
  }
}

TiltPropertiesExtensionProvider.$inject = [
  'propertiesPanel',
  'injector'
];


//function getProcessRef(element) {
//  const bo = getBusinessObject(element);
//
//  return bo.processRef;
//}
