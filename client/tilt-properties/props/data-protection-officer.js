import { removeFactory} from "./tilt-property-groups";

import { createTextField } from "./tilt-property-groups";

export function createDPOPropertyGroup(properties, element, injector, index=1){
return {
    id: `${element.id}-dpo-information-${index}`,
    label: `Data protection officer information ${index}`,
    entries: [
      {
        id: "dpo-name",
        component: createTextField,
        properties: properties,
        element: element,
        type_name: "name",
        type_label: "Name",
        type_description: "The full name of the Data Protection Officer.",
        validation_regex: /^(.|\s)*\S(.|\s)*$/,
        validation_text: "This field must have a value."
      },
      {
        id: "dpo-address",
        component: createTextField,
        properties: properties,
        element: element,
        type_name: "address",
        type_label: "Address",
        type_description: "Address of the DPO.",
        validation_regex: /^(.|\s)*\S(.|\s)*$/,
        validation_text: "This field must have a value."
      },
      {
        id: "dpo-country",
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
        id: "dpo-email",
        component: createTextField,
        properties: properties,
        element: element,
        type_name: "email",
        type_label: "E-Mail",
        type_description: "The contact email address of the Data Protection Officer.",
        validation_regex: /^(.|\s)*\S(.|\s)*$/,
        validation_text: "This field must have a value."
      },
      {
        id: "dpo-phone",
        component: createTextField,
        properties: properties,
        element: element,
        type_name: "phone",
        type_label: "Phone",
        type_description: "The phone number of the Data Protection Officer (may include country prefix).",
        validation_regex: /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/,
        validation_text: "Must be a valid phone number such as: '+49 151 1234 5678'"
      }
    ],
    remove: removeFactory(element, properties, injector.get('modeling'))
  }
}