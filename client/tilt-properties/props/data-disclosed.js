import { removeFactory} from "./tilt-property-groups";
const addFactory = require("./tilt-property-groups").addFactory;
import { createTextField } from "./tilt-property-groups";
import { createRepresentativePropertyGroup } from "./representative";
import { Group } from "@bpmn-io/properties-panel";

export function createDataDisclosedPropertyGroup(properties, element, injector, index=1){
return {
    id: `${element.id}-data-disclosed-information-${index}`,
    label: `Data disclosed information ${index}`,
    entries: [
      {
        id: "disclosed-category",
        component: createTextField,
        properties: properties,
        element: element,
        type_name: "category",
        type_label: "Category",
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
      },
      {
        id: `controller-representative`,
        label: "Controllers representative",
        component: Group,
        entries: createRepresentativePropertyGroup(properties.representative[0],element,injector).entries
      }
    ],
    remove: removeFactory(element, properties, injector.get('modeling'))
  }
}