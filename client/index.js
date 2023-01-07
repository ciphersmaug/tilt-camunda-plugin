import {
  registerPlatformBpmnJSPlugin, registerBpmnJSModdleExtension, registerClientPlugin
} from 'camunda-modeler-plugin-helpers';
import { config, resolver } from '../.bpmnlintrc';

import tiltPropertiesExtensionModule from './tilt-properties';
import tiltModdleDescriptor from "./descriptors/tilt";
registerPlatformBpmnJSPlugin(tiltPropertiesExtensionModule);
registerBpmnJSModdleExtension(tiltModdleDescriptor);



// provide { config, resolver } as a `lintRules.${tabType}` plug-in
registerClientPlugin({ config, resolver }, 'lintRules.cloud-bpmn');
registerClientPlugin({ config, resolver }, 'lintRules.bpmn');