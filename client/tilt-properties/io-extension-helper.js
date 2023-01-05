import { isAny } from 'bpmn-js/lib/features/modeling/util/ModelingUtil';
import { getBusinessObject } from 'bpmn-js/lib/util/ModelUtil';

export function findExtensions(element, types) {
  const extensionElements = getBusinessObject(element).get('extensionElements');

  if (!extensionElements) {
    return [];
  }
  if (types){
    var properties = extensionElements.get('values').filter((value) => {
      return isAny(value, [].concat(types));
    });
    if (properties.length) {
      return properties;
    } else {
      return [];
    }
  }else{
    return extensionElements.get('values')
  }
}

export function createElement(elementType, properties, parent, factory) {
  const element = factory.create(elementType, properties);
  element.$parent = parent;

  return element;
}

export function createExtensionElements(element, bpmnFactory) {
  const bo = getBusinessObject(element);
  return createElement('bpmn:ExtensionElements', { values: []}, bo, bpmnFactory);
}

export function removeDollarProperties(options){
  const pick = (obj, keys) => Object.keys(obj).filter(k => keys.includes(k)).reduce((res, k) => Object.assign(res, {[k]: obj[k]}), {});
  return pick(options,Object.keys(options).filter(item => !item.includes("$")))
}

export function updateTiltProperty(element, property, newProps, modeling) {
  const currentProps = property;
  var props = {}
  props = removeDollarProperties({
    ...currentProps,
    ...newProps
  });
  return modeling.updateModdleProperties(element, property, props);
}