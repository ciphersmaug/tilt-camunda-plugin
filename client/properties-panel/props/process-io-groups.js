import { useService } from 'bpmn-js-properties-panel';

import { is } from 'bpmn-js/lib/util/ModelUtil';

import { ListGroup, SelectEntry, TextAreaEntry, TextFieldEntry } from '@bpmn-io/properties-panel';
import { getBusinessObject } from 'bpmn-js/lib/util/ModelUtil';

import {
  createIoProperty,
  isIoProperty,
  parseIoProperty,
  updateIoProperty,
  updateTiltMetaProperty
} from '../process-io-helper';

import {
  createExtensionElements,
  createCamundaProperties,
  getExtensionElements,
  getCamundaProperties,
  getXMLTiltMetaProperties
} from '../extensions-helper';

import Ids from 'ids';

const ids = new Ids([ 16, 36, 1 ]);

export function createTiltMetaGroup(element, injector){
  const processBo = getProcessBo(element);
  const properties = getTiltMetaProperties(processBo);
  const metaGroup = {
    id: "meta-specification-group",
    label: "TILT elements",
    component: ListGroup,
    items: [
      {
        id: "tilt-meta-list",
        label: "Meta information",
        entries: [
          {
            id: "meta-name",
            component: TiltMetaNameField,
            properties: properties,
            element
          },
          {
            id: "meta-created",
            component: TiltMetaCreatedField,
            properties: properties,
            element
          },
          {
            id: "meta-modified",
            component: TiltMetaModifiedField,
            properties: properties,
            element
          },
          {
            id: "meta-version",
            component: TiltMetaVersionField,
            properties: properties,
            element
          },
          {
            id: "meta-language",
            component: TiltMetaLanguageField,
            properties: properties,
            element
          },
          {
            id: "meta-status",
            component: TiltMetaStatusField,
            properties: properties,
            element
          },
          {
            id: "meta-url",
            component: TiltMetaURLField,
            properties: properties,
            element
          }
        ]
      }
    ]
  }
  return metaGroup
}

export function createInputSpecificationGroup(element, injector) {
  const translate = injector.get('translate');

  const processBo = getProcessBo(element);

  const properties = getIOSpecificationProperties('input', processBo);

  const inputSpecificationGroup = {
    id: 'input-specification-group',
    label: translate('Input specification'),
    component: ListGroup,
    add: addPropertyFactory('input', element, injector),
    items: properties.map(function(property, index) {
      const id = `${element.id}-input-specification-${index}`;

      return PropertyItem({
        id,
        element,
        property,
        injector
      });
    })
  };

  return inputSpecificationGroup;
}

export function createOutputSpecificationGroup(element, injector) {
  const translate = injector.get('translate');

  const processBo = getProcessBo(element);

  const properties = getIOSpecificationProperties('output', processBo);

  const outputSpecificationGroup = {
    id: 'output-specification-group',
    label: translate('Output specification'),
    component: ListGroup,
    add: addPropertyFactory('output', element, injector),
    items: properties.map(function(property, index) {
      const id = `${element.id}-output-specification-${index}`;

      return PropertyItem({
        id,
        element,
        property,
        injector
      });
    })
  };

  return outputSpecificationGroup;
}


function addPropertyFactory(propertyType, element, injector) {
  const bpmnFactory = injector.get('bpmnFactory'),
        modeling = injector.get('modeling');

  function add(event) {
    event.stopPropagation();

    const property = createIoProperty(bpmnFactory, {
      type: propertyType,
      name: `var_${ids.next()}`,
      dataType: 'String',
      description: ''
    });

    const businessObject = getBusinessObject(element);

    const extensionElements = getExtensionElements(element),
          camundaProperties = getCamundaProperties(businessObject);

    let updatedBusinessObject, update;

    if (!extensionElements) {
      updatedBusinessObject = businessObject;

      const extensionElements = createExtensionElements(businessObject, bpmnFactory),
            camundaProperties = createCamundaProperties(extensionElements, bpmnFactory, { values: [ property ] });
      extensionElements.values.push(camundaProperties);
      property.$parent = camundaProperties;

      update = { extensionElements };
    } else if (!camundaProperties) {
      updatedBusinessObject = extensionElements;

      const camundaProperties = createCamundaProperties(extensionElements, bpmnFactory, { values: [ property ] });
      property.$parent = camundaProperties;

      update = { values: extensionElements.get('values').concat(camundaProperties) };
    } else {
      updatedBusinessObject = camundaProperties;
      property.$parent = camundaProperties;

      update = { values: camundaProperties.get('values').concat(property) };
    }

    modeling.updateModdleProperties(element, updatedBusinessObject, update);
  }

  return add;
}

function removeFactory(element, property, modeling) {
  return function(event) {
    event.stopPropagation();

    const businessObject = getBusinessObject(element);

    const camundaProperties = getCamundaProperties(businessObject);

    modeling.updateModdleProperties(element, camundaProperties, {
      values: camundaProperties.get('values').filter(value => value !== property)
    });
  };
}

function PropertyItem(props) {
  const {
    id,
    element,
    property,
    injector
  } = props;

  const parsed = parseIoProperty(property);

  return {
    id,
    label: `${parsed.name || ''} : ${parsed.dataType}`,
    entries: [
      {
        id: `${id}-name`,
        component: Name,
        property,
        element
      },
      {
        id: `${id}-type`,
        component: Type,
        property,
        element
      },
      {
        id: `${id}-description`,
        component: Description,
        property,
        element
      }
    ],
    autoFocusEntry: id + '-name',
    remove: removeFactory(element, property, injector.get('modeling'))
  };
}
function TiltMetaNameField(props) {
  const {
    id,
    element,
    properties
  } = props;

  const modeling = useService('modeling');
  const translate = useService('translate');
  const debounce = useService('debounceInput');

  const setValue = (value) => {
    updateTiltMetaProperty(element, properties, {name:value || ''}, modeling);
  };

  const getValue = () => {
    return properties.name || "";
  };

  // return error if contains spaces
  const validate = (value) => {
    if (!value) {
      return translate('This field must have a value.');
    }
  };

  return TextFieldEntry({
    element: properties,
    id,
    label: "Name",
    description: "The Name of the Company",
    getValue,
    setValue,
    debounce,
    validate
  });
}

function TiltMetaCreatedField(props) {
  const {
    id,
    element,
    properties
  } = props;

  const modeling = useService('modeling');
  const translate = useService('translate');
  const debounce = useService('debounceInput');

  const setValue = (value) => {
    updateTiltMetaProperty(element, properties, {created:value || ''}, modeling);
  };

  const getValue = () => {
    return properties.created || "";
  };

  // return error if contains spaces
  const validate = (value) => {
    if (!/^([\+-]?\d{4}(?!\d{2}\b))((-?)((0[1-9]|1[0-2])(\3([12]\d|0[1-9]|3[01]))?|W([0-4]\d|5[0-2])(-?[1-7])?|(00[1-9]|0[1-9]\d|[12]\d{2}|3([0-5]\d|6[1-6])))([T\s]((([01]\d|2[0-3])((:?)[0-5]\d)?|24\:?00)([\.,]\d+(?!:))?)?(\17[0-5]\d([\.,]\d+)?)?([zZ]|([\+-])([01]\d|2[0-3]):?([0-5]\d)?)?)?)?$/.test(value)) {
      return translate('This field must have an ISO');
    }
  };

  return TextFieldEntry({
    element: properties,
    id,
    label: "Created",
    description: "The timestamp this document was created.",
    getValue,
    setValue,
    debounce,
    validate
  });
}

function TiltMetaModifiedField(props) {
  const {
    id,
    element,
    properties
  } = props;

  const modeling = useService('modeling');
  const translate = useService('translate');
  const debounce = useService('debounceInput');

  const setValue = (value) => {
    updateTiltMetaProperty(element, properties, {modified:value || ''}, modeling);
  };

  const getValue = () => {
    return properties.modified || "";
  };

  // return error if contains spaces
  const validate = (value) => {
    if (!/^([\+-]?\d{4}(?!\d{2}\b))((-?)((0[1-9]|1[0-2])(\3([12]\d|0[1-9]|3[01]))?|W([0-4]\d|5[0-2])(-?[1-7])?|(00[1-9]|0[1-9]\d|[12]\d{2}|3([0-5]\d|6[1-6])))([T\s]((([01]\d|2[0-3])((:?)[0-5]\d)?|24\:?00)([\.,]\d+(?!:))?)?(\17[0-5]\d([\.,]\d+)?)?([zZ]|([\+-])([01]\d|2[0-3]):?([0-5]\d)?)?)?)?$/.test(value)) {
      return translate('This field must have an ISO');
    }
  };

  return TextFieldEntry({
    element: properties,
    id,
    label: "Modified",
    description: "The timestamp this document was modified.",
    getValue,
    setValue,
    debounce,
    validate
  });
}
function TiltMetaVersionField(props) {
  const {
    id,
    element,
    properties
  } = props;

  const modeling = useService('modeling');
  const translate = useService('translate');
  const debounce = useService('debounceInput');

  const setValue = (value) => {
    updateTiltMetaProperty(element, properties, {version:value || ''}, modeling);
  };

  const getValue = () => {
    return properties.version || "";
  };

  const validate = (value) => {
    if (!/^[1-9]\d*$/.test(value)) {
      return translate('This field must have an integer value.');
    }
  };

  return TextFieldEntry({
    element: properties,
    id,
    label: "Version",
    description: "The version of the transparency information.",
    getValue,
    setValue,
    debounce,
    validate
  });
}
function TiltMetaLanguageField(props) {
  const {
    id,
    element,
    properties
  } = props;

  const modeling = useService('modeling');
  const translate = useService('translate');
  const debounce = useService('debounceInput');

  const setValue = (value) => {
    updateTiltMetaProperty(element, properties, {language:value || ''}, modeling);
  };

  const getValue = () => {
    return properties.language || "";
  };

  // return error if contains spaces
  const validate = (value) => {
    if (!/^(aa|ab|ae|af|ak|am|an|ar|as|av|ay|az|az|ba|be|bg|bh|bi|bm|bn|bo|br|bs|ca|ce|ch|co|cr|cs|cu|cv|cy|da|de|dv|dz|ee|el|en|eo|es|et|eu|fa|ff|fi|fj|fo|fr|fy|ga|gd|gl|gn|gu|gv|ha|he|hi|ho|hr|ht|hu|hy|hz|ia|id|ie|ig|ii|ik|io|is|it|iu|ja|jv|ka|kg|ki|kj|kk|kl|km|kn|ko|kr|ks|ku|kv|kw|ky|la|lb|lg|li|ln|lo|lt|lu|lv|mg|mh|mi|mk|ml|mn|mr|ms|mt|my|na|nb|nd|ne|ng|nl|nn|no|nr|nv|ny|oc|oj|om|or|os|pa|pi|pl|ps|pt|qu|rm|rn|ro|ru|rw|sa|sc|sd|se|sg|si|sk|sl|sm|sn|so|sq|sr|ss|st|su|sv|sw|ta|te|tg|th|ti|tk|tl|tn|to|tr|ts|tt|tw|ty|ug|uk|ur|uz|ve|vi|vo|wa|wo|xh|yi|yo|za|zh|zu)$/.test(value)) {
      return translate('This field must have a valid language abbreviation code');
    }
  };

  return TextFieldEntry({
    element: properties,
    id,
    label: "Language",
    description: "The language tag of this document.",
    getValue,
    setValue,
    debounce,
    validate
  });
}
function TiltMetaStatusField(props) {
  const {
    id,
    element,
    properties
  } = props;

  const modeling = useService('modeling');
  const translate = useService('translate');
  const debounce = useService('debounceInput');

  const setValue = (value) => {
    updateTiltMetaProperty(element, properties, {status:value || ''}, modeling);
  };

  const getValue = () => {
    return properties.status || "";
  };

  // return error if contains spaces
  const validate = (value) => {
    if (!/^(active|inactive)$/.test(value)) {
      return translate('This field must be either "active" or "inactive".');
    }
  };

  return TextFieldEntry({
    element: properties,
    id,
    label: "Status",
    description: "The status of whether this policy is actively in use.",
    getValue,
    setValue,
    debounce,
    validate
  });
}

function TiltMetaURLField(props) {
  const {
    id,
    element,
    properties
  } = props;

  const modeling = useService('modeling');
  const translate = useService('translate');
  const debounce = useService('debounceInput');

  const setValue = (value) => {
    updateTiltMetaProperty(element, properties, {url:value || ''}, modeling);
  };

  const getValue = () => {
    return properties.url || "";
  };

  // return error if contains spaces
  const validate = (value) => {
    if (!value) {
      return translate('This field must be filled in.');
    }
  };

  return TextFieldEntry({
    element: properties,
    id,
    label: "URL",
    description: "The URL under which the privacy policy can be found.",
    getValue,
    setValue,
    debounce,
    validate
  });
}

function Name(props) {
  const {
    id,
    element,
    property
  } = props;

  const modeling = useService('modeling');
  const translate = useService('translate');
  const debounce = useService('debounceInput');

  const setValue = (value) => {
    updateIoProperty(element, property, { name: value || '' }, modeling);
  };

  const getValue = () => {
    return parseIoProperty(property).name || '';
  };

  // return error if contains spaces
  const validate = (value) => {
    if (!value) {
      return translate('Parameter must have a name.');
    }

    if (/\s/.test(value)) {
      return translate('Name must not contain spaces.');
    }
  };

  return TextFieldEntry({
    element: property,
    id,
    label: translate('Name'),
    getValue,
    setValue,
    debounce,
    validate
  });
}

function Type(props) {
  const {
    id,
    element,
    property
  } = props;

  const modeling = useService('modeling');
  const translate = useService('translate');

  const setValue = (value) => {
    updateIoProperty(element, property, { dataType: value }, modeling);
  };

  const getValue = () => {
    return parseIoProperty(property).dataType || 'String';
  };

  return SelectEntry({
    element: property,
    id,
    label: translate('Type'),
    getOptions() {
      return [
        { value: 'String', label: translate('String') },
        { value: 'int', label: translate('int') },
        { value: 'boolean', label: translate('boolean') },
        { value: 'double', label: translate('double') },
        { value: 'Date', label: translate('Date') }
      ];
    },
    getValue,
    setValue
  });
}

function Description(props) {
  const {
    id,
    element,
    property
  } = props;

  const modeling = useService('modeling');
  const translate = useService('translate');
  const debounce = useService('debounceInput');

  const setValue = (value) => {
    updateIoProperty(element, property, { description: value || '' }, modeling);
  };

  const getValue = () => {
    return parseIoProperty(property).description || '';
  };

  return TextAreaEntry({
    element: property,
    id,
    label: translate('Description'),
    getValue,
    setValue,
    debounce
  });
}


// helper

/**
 * Get process business object from process element or participant.
 */
function getProcessBo(element) {
  const bo = getBusinessObject(element);

  if (is(element, 'bpmn:Participant')) {
    bo = bo.processRef;
  }

  return bo;
}

function getTiltMetaProperties(processBo){
  const tiltMetaProperties = getXMLTiltMetaProperties(processBo);

  console.log(tiltMetaProperties)
  if (!tiltMetaProperties) {
    return [];
  }
  return tiltMetaProperties;
}

function getIOSpecificationProperties(type, processBo) {
  const camundaProperties = getCamundaProperties(processBo);

  if (!camundaProperties) {
    return [];
  }

  return camundaProperties.get('values')
    .filter(property => isIoProperty(property))
    .filter(property => parseIoProperty(property).type === type);
}
