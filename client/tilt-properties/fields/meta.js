import { useService } from 'bpmn-js-properties-panel';
import { TextFieldEntry } from '@bpmn-io/properties-panel';

import {
  updateTiltMetaProperty
} from '../tilt-io-helper';

export function createTextField(props){
  const {
    id,
    element,
    properties,
    type_name,
    type_label,
    type_description,
    validation_regex,
    validation_text
  } = props;

  const modeling = useService('modeling');
  const translate = useService('translate');
  const debounce = useService('debounceInput');

  const setValue = (value) => {
    var newPropertyObject = {};
    newPropertyObject[type_name] = value || '';
    updateTiltMetaProperty(element, properties, newPropertyObject, modeling);
  };

  const getValue = () => {
    return properties[type_name] || "";
  };

  const validate = (value) => {
    if (!validation_regex.test(value)) {
      return translate(validation_text);
    }
  };

  return TextFieldEntry({
    element: properties,
    id,
    label: type_label,
    description: type_description,
    getValue,
    setValue,
    debounce,
    validate
  });
}


export function TiltMetaNameField(props) {
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
  
  export function TiltMetaCreatedField(props) {
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
  
  export function TiltMetaModifiedField(props) {
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
        return translate('This field must have an ISO Timestamp');
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
  export function TiltMetaVersionField(props) {
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
  export function TiltMetaLanguageField(props) {
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
  export function TiltMetaStatusField(props) {
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
  
  export function TiltMetaURLField(props) {
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