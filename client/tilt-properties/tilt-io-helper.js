export function composeTiltMetaPropertyProps(options){
  var {
    name,
    created,
    modified,
    version,
    language,
    status,
    url
  } = options;
  return {name,created,modified,version,language,status,url};
}

export function composeTiltControllerPropertyProps(options){
  var {
    name,
    division,
    address,
    country
  } = options;
  return {name,division,address,country};
}

/**
 * Craft the UPDATE command to set a property value.
 */

export function updateTiltProperty(element, property, newProps, modeling, tilt_type) {
  const currentProps = property;
  var props = {}
  switch(tilt_type){
    case "meta":
      props = composeTiltMetaPropertyProps({
        ...currentProps,
        ...newProps
      });
      break;
    case "controller":
      props = composeTiltControllerPropertyProps({
        ...currentProps,
        ...newProps
      });
      break;
    default:
      console.error(`The tilt property ${tilt_type} cannot be updated.`)
      break;
  }

  return modeling.updateModdleProperties(element, property, props);
}

//export function createMetaProperty(factory, options) {
//  return factory.create('tilt:Meta', composeTiltMetaPropertyProps(options));
//}
