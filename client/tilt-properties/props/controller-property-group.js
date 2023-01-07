import { removeFactory } from "./tilt-property-groups";
import { createTextField } from "./tilt-property-groups";

export function createControllerPropertyGroup(properties, element, injector, index=1){
return {
    id: `${element.id}-controller-information-${index}`,
    label: `Controller information ${index}`,
    entries: [
      {
        id: "controller-name",
        component: createTextField,
        properties: properties,
        element: element,
        type_name: "name",
        type_label: "Name",
        type_description: "Name of the Controller.",
        validation_regex: /^(.|\s)*\S(.|\s)*$/,
        validation_text: "This field must have a value."
      },
      {
        id: "controller-division",
        component: createTextField,
        properties: properties,
        element: element,
        type_name: "division",
        type_label: "Division",
        type_description: "Serves to differentiate between different areas of a company; particularly relevant for large companies.",
        validation_regex: /^[\s\S]+$/,
        validation_text: "This field can be anything. It is not required."
      },
      {
        id: "controller-address",
        component: createTextField,
        properties: properties,
        element: element,
        type_name: "address",
        type_label: "Address",
        type_description: "Address of the controller.",
        validation_regex: /^(.|\s)*\S(.|\s)*$/,
        validation_text: "This field must have a value."
      },
      {
        id: "controller-country",
        component: createTextField,
        properties: properties,
        element: element,
        type_name: "country",
        type_label: "Country",
        type_description: "All country codes follow the established ones ISO 3166 country abbreviation standard.",
        validation_regex: /^[A-Z][A-Z]$/,
        validation_text: "All country codes follow the established ones ISO 3166 country abbreviation standard."
      }
    ],
    remove: removeFactory(element, properties, injector.get('modeling'))
  }
}