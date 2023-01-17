import { createCheckBox, removeFactory} from "./tilt-property-groups";
const addFactory = require("./tilt-property-groups").addFactory;
import { createTextField } from "./tilt-property-groups";
//import { createRepresentativePropertyGroup } from "./representative";
import { ListGroup, Group } from "@bpmn-io/properties-panel";
import PropertyBlueprint from "../property-blueprint";

export function createEmptyTiltProperty(properties,element,injector,tilt_name,initialization_properties = {}){
  if(properties.hasOwnProperty(tilt_name)){
    if (properties[tilt_name].length == 0){
      var capitalized_property = tilt_name.charAt(0).toUpperCase() + tilt_name.slice(1);
      addFactory(element, injector,[new PropertyBlueprint(`tilt:${capitalized_property}`, initialization_properties, properties)]).call();
    }
  }
}

export function createDataDisclosedPropertyGroup(properties, element, injector, index=1){
  // Create lists of all existing Properties
    var purposes = [], legalBases = [], legitimateInterests = [], recipients = [], storage = [];
    for(var p in properties.purpose){
      purposes.push(createPurposesPropertyGroup(properties.purpose[p],element,injector,parseInt(p)+1));
    }
    for(var l in properties.legalBasis){
      legalBases.push(createLegalBasisPropertyGroup(properties.legalBasis[l],element,injector,parseInt(l)+1));
    }
    for(var l in properties.legitimateInterest){
      legitimateInterests.push(createLegitimateInterestPropertyGroup(properties.legitimateInterest[l],element,injector,parseInt(l)+1));
    }
    for(var r in properties.recipient){
      recipients.push(createRecipientPropertyGroup(properties.recipient[r],element,injector,parseInt(r)+1));
    }
    for(var s in properties.storage){
      storage.push(createStoragePropertyGroup(properties.storage[s],element,injector,parseInt(s)+1));
    }

return {
    id: `${element.id}-data-disclosed-information-${index}`,
    label: `Data disclosed ${index}`,
    entries: [
      {
        id: "disclosed-id",
        component: createTextField,
        properties: properties,
        element: element,
        type_name: "id",
        type_label: "ID",
        type_description: "The id of a data item that is disclosed. The id is necessary to distinguish several processing tasks of the same data item (locally unique ID that can be based on the database implementation).",
        validation_regex: /^(.|\s)*\S(.|\s)*$/,
        validation_text: "This field must have a value."
      },
      {
        id: "disclosed-category",
        component: createTextField,
        properties: properties,
        element: element,
        type_name: "category",
        type_label: "Category",
        type_description: "The data (category) the data disclosed is referred to.",
        validation_regex: /^(.|\s)*\S(.|\s)*$/,
        validation_text: "This field must have a value."
      },
      {
        id: `disclosed-purposes`,
        label: "Purposes",
        component: ListGroup,
        add: addFactory(element, injector,[new PropertyBlueprint("tilt:Purpose", {}, properties)]),
        items: purposes
      },
      {
        id: `disclosed-legal-bases`,
        label: "Legal bases",
        component: ListGroup,
        add: addFactory(element, injector,[new PropertyBlueprint("tilt:LegalBasis", {}, properties)]),
        items: legalBases
      },
      {
        id: `disclosed-legitimate-interests`,
        label: "Legitimate interests",
        component: ListGroup,
        add: addFactory(element, injector,[new PropertyBlueprint("tilt:LegitimateInterest", {}, properties)]),
        items: legitimateInterests
      },
      {
        id: `disclosed-recipients`,
        label: "Recipients",
        component: ListGroup,
        add: addFactory(element, injector,[new PropertyBlueprint("tilt:Recipient", {representative : []}, properties)]),
        items: recipients
      }
      //{
      //  id: `disclosed-storage`,
      //  label: "Storage",
      //  component: ListGroup,
      //  add: addFactory(element, injector,[new PropertyBlueprint("tilt:Storage", {representative : []}, properties)]),
      //  items: storage
      //}
    ],
    remove: removeFactory(element, properties, injector.get('modeling'))
  }
}

export function createPurposesPropertyGroup(properties, element, injector, index=1){
  return {
    id: `${element.id}-purposes-information-${index}`,
    label: `Purpose ${index}`,
    entries: [
      {
        id: "purpose-purpose",
        component: createTextField,
        properties: properties,
        element: element,
        type_name: "purpose",
        type_label: "Purpose",
        type_description: "In this schema the purpose is specified (i.e. a headline or purpose category).he id of a data item that is disclosed. The id is necessary to distinguish several processing tasks of the same data item (locally unique ID that can be based on the database implementation).",
        validation_regex: /^(.|\s)*\S(.|\s)*$/,
        validation_text: "This field must have a value."
      },
      {
        id: "purpose-description",
        component: createTextField,
        properties: properties,
        element: element,
        type_name: "description",
        type_label: "Description",
        type_description: "This schema refers to an exact description of the purpose the data is processed for.",
        validation_regex: /^(.|\s)*\S(.|\s)*$/,
        validation_text: "This field must have a value."
      }
    ],
    remove: removeFactory(element, properties, injector.get('modeling'))
  }
}

export function createLegalBasisPropertyGroup(properties, element, injector, index=1){
  return {
    id: `${element.id}-legal-bases-information-${index}`,
    label: `Legal base ${index}`,
    entries: [
      {
        id: "legal-base-reference",
        component: createTextField,
        properties: properties,
        element: element,
        type_name: "reference",
        type_label: "Reference",
        type_description: "This field refers to the reference in legal regulations (laws, orders, declaration etc.).",
        validation_regex: /^[A-Z]*([-]?[0-9]*|[a-z]*)*$/,
        validation_text: "The format is set to uppercase letters for the legal text followed by hyphened numbers and lowercase letters for the exact location."
      },
      {
        id: "legal-base-description",
        component: createTextField,
        properties: properties,
        element: element,
        type_name: "description",
        type_label: "Description",
        type_description: "An explanation about the legal basis used.",
        validation_regex: /^[\s\S]+$/,
        validation_text: "This field can be anything. It is not required."
      }
    ],
    remove: removeFactory(element, properties, injector.get('modeling'))
  }
}

export function createLegitimateInterestPropertyGroup(properties, element, injector, index=1){
  return {
    id: `${element.id}-legitimate-interest-information-${index}`,
    label: `Legitimate interest ${index}`,
    entries: [
      {
        id: "legitimate-interest-existence",
        component: createCheckBox,
        properties: properties,
        element: element,
        type_name: "exists",
        type_label: "Exists",
        type_description: "The legitimate interest only has to be stated if the processing is carried out in accordance with Art. 13 (1d). This field refers to the existence of such an interest.",
      },
      {
        id: "legitimate-interest-reasoning",
        component: createTextField,
        properties: properties,
        element: element,
        type_name: "reasoning",
        type_label: "Reasoning",
        type_description: "If the legitimate interest has to be stated because the processing is carried out in accordance with Art. 13 (1d), it is described in here.",
        validation_regex: /^[\s\S]+$/,
        validation_text: "This field can be anything. It is not required."
      }
    ],
    remove: removeFactory(element, properties, injector.get('modeling'))
  }
}

export function createRecipientPropertyGroup(properties, element, injector, index=1){
  createEmptyTiltProperty(properties,element,injector,"representative")
  return {
    id: `${element.id}-recipient-information-${index}`,
    label: `Recipient ${index}`,
    entries: [
      {
        id: "recipient-name",
        component: createTextField,
        properties: properties,
        element: element,
        type_name: "name",
        type_label: "Name",
        type_description: "The name of the third party (recipient).",
        validation_regex: /^[\s\S]+$/,
        validation_text: "This field can be anything. It is not required."
      },
      {
        id: "recipient-division",
        component: createTextField,
        properties: properties,
        element: element,
        type_name: "division",
        type_label: "Division",
        type_description: "The division of the third party (recipient) for structuring controllers into smaller entities.",
        validation_regex: /^[\s\S]+$/,
        validation_text: "This field can be anything. It is not required."
      },
      {
        id: "recipient-address",
        component: createTextField,
        properties: properties,
        element: element,
        type_name: "address",
        type_label: "Address",
        type_description: "The address of the third party (recipient).",
        validation_regex: /^[\s\S]+$/,
        validation_text: "This field can be anything. It is not required."
      },
      {
        id: "recipient-country",
        component: createTextField,
        properties: properties,
        element: element,
        type_name: "country",
        type_label: "Country",
        type_description: "The country in which the recipient is located at. Attention: This explictly specifies third country transfers!",
        validation_regex: /^[A-Z][A-Z]$/,
        validation_text: "This field needs to be a country code. It is not required."
      },
      {
        id: `recipient-representative`,
        label: "Recipients representative",
        component: Group,
        entries: createRepresentativePropertyGroup(properties.representative[0],element,injector).entries
      },
      {
        id: "recipient-category",
        component: createTextField,
        properties: properties,
        element: element,
        type_name: "category",
        type_label: "Category",
        type_description: "The category of the the recipient.",
        validation_regex: /^(.|\s)*\S(.|\s)*$/,
        validation_text: "This field must have a value."
      }
    ],
    remove: removeFactory(element, properties, injector.get('modeling'))
  }
}

export function createStoragePropertyGroup(properties, element, injector, index=1){
  // Create lists of all existing Properties
  var temporal = [],  purpose_conditional = [], basis_conditional = [];
  for(var t in properties.temporal){
    temporal.push(createTemporalStoragePropertyGroup(properties.temporal[t],element,injector,parseInt(t)+1));
  }
  for(var p in properties.purposeConditional){
    purpose_conditional.push(createPurposeConditionalPropertyGroup(properties.purposeConditional[p],element,injector,parseInt(p)+1));
  }
  for(var l in properties.legalBasisConditional){
    basis_conditional.push(createBasisConditionalPropertyGroup(properties.legalBasisConditional[l],element,injector,parseInt(l)+1));
  }

  return {
    id: `${element.id}-storage-information-${index}`,
    label: `Storage ${index}`,
    entries: [
      {
        id: "storage-name",
        component: createTextField,
        properties: properties,
        element: element,
        type_name: "name",
        type_label: "Name",
        type_description: "The name of the third party (recipient).",
        validation_regex: /^[\s\S]+$/,
        validation_text: "This field can be anything. It is not required."
      },
      {
        id: `storage-temporal`,
        label: "Temporal storage",
        component: ListGroup,
        add: addFactory(element, injector,[new PropertyBlueprint("tilt:StorageTemporal", {}, properties)]),
        items: temporal
      },
      {
        id: `storage-purpose-conditional`,
        label: "Purpose conditional storage",
        component: ListGroup,
        add: addFactory(element, injector,[new PropertyBlueprint("tilt:StoragePurposeConditional", {}, properties)]),
        items: purpose_conditional
      },
      {
        id: `storage-legal-basis-conditional`,
        label: "Legal basis conditional storage",
        component: ListGroup,
        add: addFactory(element, injector,[new PropertyBlueprint("tilt:StorageLegalBasisConditional", {}, properties)]),
        items: basis_conditional
      },
      {
        id: "storage-aggregate-function",
        component: createTextField,
        properties: properties,
        element: element,
        type_name: "aggregateFunction",
        type_label: "Aggregation function",
        type_description: "The aggregation function describes the calculation basis when specifying several time intervals. For example, if there is storage for 2 weeks for technical reasons (e.g. backup), but there is a legally longer retention period, the maximum aggregation function (max) would be selected (standard case).",
        validation_regex: /^min|max|avg|sum$/,
        validation_text: "Aggregation functions available: min, max, sum, avg"
      }
    ],
    remove: removeFactory(element, properties, injector.get('modeling'))
  }
}

export function createTemporalStoragePropertyGroup(properties, element, injector, index=1){
  return {
    id: `${element.id}-storage-information-${index}`,
    label: `Storage ${index}`,
    entries: [
      {
        id: "storage-name",
        component: createTextField,
        properties: properties,
        element: element,
        type_name: "name",
        type_label: "Name",
        type_description: "The name of the third party (recipient).",
        validation_regex: /^[\s\S]+$/,
        validation_text: "This field can be anything. It is not required."
      },
      {
        id: `storage-temporal`,
        label: "Temporal storage",
        component: ListGroup,
        add: addFactory(element, injector,[new PropertyBlueprint("tilt:StorageTemporal", {}, properties)]),
        items: temporal
      },
      {
        id: `storage-purpose-conditional`,
        label: "Purpose conditional storage",
        component: ListGroup,
        add: addFactory(element, injector,[new PropertyBlueprint("tilt:StoragePurposeConditional", {}, properties)]),
        items: purpose_conditional
      },
      {
        id: `storage-legal-basis-conditional`,
        label: "Legal basis conditional storage",
        component: ListGroup,
        add: addFactory(element, injector,[new PropertyBlueprint("tilt:StorageLegalBasisConditional", {}, properties)]),
        items: basis_conditional
      },
      {
        id: "storage-aggregate-function",
        component: createTextField,
        properties: properties,
        element: element,
        type_name: "aggregateFunction",
        type_label: "Aggregation function",
        type_description: "The aggregation function describes the calculation basis when specifying several time intervals. For example, if there is storage for 2 weeks for technical reasons (e.g. backup), but there is a legally longer retention period, the maximum aggregation function (max) would be selected (standard case).",
        validation_regex: /^min|max|avg|sum$/,
        validation_text: "Aggregation functions available: min, max, sum, avg"
      }
    ],
    remove: removeFactory(element, properties, injector.get('modeling'))
  }
}