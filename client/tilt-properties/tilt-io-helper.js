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

/**
 * Craft the UPDATE command to set a property value.
 */
 export function updateTiltMetaProperty(element, property, newProps, modeling) {
  const currentProps = property;

  const props = composeTiltMetaPropertyProps({
    ...currentProps,
    ...newProps
  });
  return modeling.updateModdleProperties(element, property, props);
}

export function createMetaProperty(factory, options) {
  return factory.create('tilt:Meta', composeTiltMetaPropertyProps(options));
}