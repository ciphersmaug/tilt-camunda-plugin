import { removeFactory } from "./tilt-property-groups";
import { createTextField } from "./tilt-property-groups";

export function createRepresentativePropertyGroup(properties, element, injector, index=1){
return [
      {
        id: "representative-name",
        component: createTextField,
        properties: properties,
        element: element,
        type_name: "name",
        type_label: "Name",
        type_description: "Name of the controller's representative.",
        validation_regex: /^(.|\s)*\S(.|\s)*$/,
        validation_text: "This field must have a value."
      },
      {
        id: "representative-email",
        component: createTextField,
        properties: properties,
        element: element,
        type_name: "email",
        type_label: "E-Mail",
        type_description: "Email address of the controller's representative.",
        validation_regex: /^(.|\s)*\S(.|\s)*$/,
        validation_text: "This field must have a value."
      },
      {
        id: "representative-phone",
        component: createTextField,
        properties: properties,
        element: element,
        type_name: "phone",
        type_label: "Phone",
        type_description: "Phone number of the controller's representative.",
        validation_regex: /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/,
        validation_text: "Must be a valid phone number such as: '+49 151 1234 5678'"
      }
    ]
}