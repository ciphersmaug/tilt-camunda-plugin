'use-strict'
export default class PropertyBlueprint{
    tilt_type;
    property_name;
    initialization_properties;
    parent_element;
    constructor(tilt_type,initialization_properties,parent_element){
        this.tilt_type = tilt_type;
        this.initialization_properties = initialization_properties;
        this.parent_element = parent_element;
        this.property_name = tilt_type.split(":")[1];
    }
}