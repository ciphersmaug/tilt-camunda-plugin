import { is } from 'bpmn-js/lib/util/ModelUtil';
import PropertyBlueprint from './property-blueprint';
import { createTiltPropertiesGroup } from './props/tilt-property-groups';

/**
 * An extension that makes  tilt properties configurable via a new
 * properties tab.
 *
 */
export default class TiltPropertiesExtensionProvider {
  constructor(propertiesPanel, injector) {
    this._injector = injector;
    window.bpmnjsInjector = injector;
    propertiesPanel.registerProvider(this);
  }

  getGroups(element) {
    return groups => {
      groups = groups.slice();

      if(is(element, 'bpmn:Process')) {
      
        groups.push(createTiltPropertiesGroup(element,this._injector,[
          new PropertyBlueprint("tilt:Meta",{},null),
          new PropertyBlueprint("tilt:Controller",{representative:[]},null),
          new PropertyBlueprint("tilt:DataProtectionOfficer",{},null)
          ],[1,1,1]));
      
      }else if(is(element,'bpmn:Collaboration')) {
      
        groups.push(createTiltPropertiesGroup(element,this._injector,[
          new PropertyBlueprint("tilt:Meta",{},null)
          ],[1]));
      
      }else if(is(element, 'bpmn:Participant') || is(element,'bpmn:Lane')) {
      
        groups.push(createTiltPropertiesGroup(element,this._injector,[
          new PropertyBlueprint("tilt:Controller",{representative:[]},null),
          new PropertyBlueprint("tilt:DataProtectionOfficer",{},null)
          ],[1,1]));
      
      }else if(is(element, 'bpmn:StartEvent')) {
      
        groups.push(createTiltPropertiesGroup(element,this._injector,[
          new PropertyBlueprint("tilt:Controller",{representative:[]},null)
          ],[1]));
      
      }else if(is(element, 'bpmn:DataObjectReference')) {
      
        groups.push(createTiltPropertiesGroup(element,this._injector,[
          new PropertyBlueprint("tilt:DataDisclosed",{},null)
          ],[Number.MAX_SAFE_INTEGER]));
      
      }else if(is(element, 'bpmn:MessageFlow')) {
      
        groups.push(createTiltPropertiesGroup(element,this._injector,[
          new PropertyBlueprint("tilt:ThirdCountriesTransfer",{},null)
          ],[1]));
      
      }else{
      
        var newGroup = createTiltPropertiesGroup(element,this._injector,[],[])
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