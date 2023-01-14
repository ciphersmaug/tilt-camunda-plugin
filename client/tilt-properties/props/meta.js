import { removeFactory } from "./tilt-property-groups";
import { createTextField } from "./tilt-property-groups";

export function createMetaPropertyGroup(properties,element,injector,index=1){
return {
    id: `${element.id}-meta-information-${index}`,
    label: `Meta information ${index}`,
    entries: [
      {
        id: "meta-name",
        component: createTextField,
        properties: properties,
        element: element,
        type_name: "name",
        type_label: "Name",
        type_description: "The Name of the Company.",
        validation_regex: /^(.|\s)*\S(.|\s)*$/,
        validation_text: "This field must have a value."
      },
      {
        id: "meta-created",
        component: createTextField,
        properties: properties,
        element: element,
        type_name: "created",
        type_label: "Created",
        type_description: "The timestamp this document was created.",
        validation_regex: /^([\+-]?\d{4}(?!\d{2}\b))((-?)((0[1-9]|1[0-2])(\3([12]\d|0[1-9]|3[01]))?|W([0-4]\d|5[0-2])(-?[1-7])?|(00[1-9]|0[1-9]\d|[12]\d{2}|3([0-5]\d|6[1-6])))([T\s]((([01]\d|2[0-3])((:?)[0-5]\d)?|24\:?00)([\.,]\d+(?!:))?)?(\17[0-5]\d([\.,]\d+)?)?([zZ]|([\+-])([01]\d|2[0-3]):?([0-5]\d)?)?)?)?$/,
        validation_text: "This field must have an ISO Timestamp."
      },
      {
        id: "meta-modified",
        component: createTextField,
        properties: properties,
        element: element,
        type_name: "modified",
        type_label: "Modified",
        type_description: "The timestamp this document was modified.",
        validation_regex: /^([\+-]?\d{4}(?!\d{2}\b))((-?)((0[1-9]|1[0-2])(\3([12]\d|0[1-9]|3[01]))?|W([0-4]\d|5[0-2])(-?[1-7])?|(00[1-9]|0[1-9]\d|[12]\d{2}|3([0-5]\d|6[1-6])))([T\s]((([01]\d|2[0-3])((:?)[0-5]\d)?|24\:?00)([\.,]\d+(?!:))?)?(\17[0-5]\d([\.,]\d+)?)?([zZ]|([\+-])([01]\d|2[0-3]):?([0-5]\d)?)?)?)?$/,
        validation_text: "This field must have an ISO Timestamp."
      },
      {
        id: "meta-version",
        component: createTextField,
        properties: properties,
        element: element,
        type_name: "version",
        type_label: "Version",
        type_description: "The version of the transparency information.",
        validation_regex: /^[1-9]\d*$/,
        validation_text: "This field must have an integer value."
      },
      {
        id: "meta-language",
        component: createTextField,
        properties: properties,
        element: element,
        type_name: "language",
        type_label: "Language",
        type_description: "The language tag of this document.",
        validation_regex: /^(aa|ab|ae|af|ak|am|an|ar|as|av|ay|az|az|ba|be|bg|bh|bi|bm|bn|bo|br|bs|ca|ce|ch|co|cr|cs|cu|cv|cy|da|de|dv|dz|ee|el|en|eo|es|et|eu|fa|ff|fi|fj|fo|fr|fy|ga|gd|gl|gn|gu|gv|ha|he|hi|ho|hr|ht|hu|hy|hz|ia|id|ie|ig|ii|ik|io|is|it|iu|ja|jv|ka|kg|ki|kj|kk|kl|km|kn|ko|kr|ks|ku|kv|kw|ky|la|lb|lg|li|ln|lo|lt|lu|lv|mg|mh|mi|mk|ml|mn|mr|ms|mt|my|na|nb|nd|ne|ng|nl|nn|no|nr|nv|ny|oc|oj|om|or|os|pa|pi|pl|ps|pt|qu|rm|rn|ro|ru|rw|sa|sc|sd|se|sg|si|sk|sl|sm|sn|so|sq|sr|ss|st|su|sv|sw|ta|te|tg|th|ti|tk|tl|tn|to|tr|ts|tt|tw|ty|ug|uk|ur|uz|ve|vi|vo|wa|wo|xh|yi|yo|za|zh|zu)$/,
        validation_text: "This field must have a valid language abbreviation code."
      },
      {
        id: "meta-status",
        component: createTextField,
        properties: properties,
        element: element,
        type_name: "status",
        type_label: "Status",
        type_description: "The status of whether this policy is actively in use.",
        validation_regex: /^(active|inactive)$/,
        validation_text: "This field must be either be 'active' or 'inactive'."
      },
      {
        id: "meta-url",
        component: createTextField,
        properties: properties,
        element: element,
        type_name: "url",
        type_label: "URL",
        type_description: "The URL under which the privacy policy can be found.",
        validation_regex: /^(.|\s)*\S(.|\s)*$/,
        validation_text: "This field must be filled in."
      }
    ],
    remove: removeFactory(element, properties, injector.get('modeling'))
  }
}