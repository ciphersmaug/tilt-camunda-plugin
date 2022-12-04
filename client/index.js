import {
  registerPlatformBpmnJSPlugin, registerBpmnJSModdleExtension
} from 'camunda-modeler-plugin-helpers';

import propertiesPanelExtensionModule from './properties-panel';
import tiltModdleDescriptor from "./descriptors/tilt";
import tiltPropertiesProviderModule from "./tilt";
registerPlatformBpmnJSPlugin(propertiesPanelExtensionModule);
registerPlatformBpmnJSPlugin(tiltPropertiesProviderModule);
registerBpmnJSModdleExtension(tiltModdleDescriptor);