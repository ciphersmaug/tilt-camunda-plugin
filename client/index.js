import {
  registerPlatformBpmnJSPlugin, registerBpmnJSModdleExtension
} from 'camunda-modeler-plugin-helpers';

import tiltPropertiesExtensionModule from './tilt-properties';
import tiltModdleDescriptor from "./descriptors/tilt";
registerPlatformBpmnJSPlugin(tiltPropertiesExtensionModule);
registerBpmnJSModdleExtension(tiltModdleDescriptor);