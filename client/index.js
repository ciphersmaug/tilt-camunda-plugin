import {
  registerPlatformBpmnJSPlugin, registerBpmnJSModdleExtension, registerClientPlugin, registerBpmnJSPlugin, registerClientExtension
} from 'camunda-modeler-plugin-helpers';
import { config, resolver } from '../.bpmnlintrc';

import tiltPropertiesExtensionModule from './tilt-properties';
import tiltModdleDescriptor from "./descriptors/tilt";

import ExtractButton from './tilt-extractor/extract-button';

var tiltExtractor = require('./tilt-extractor/tilt-extractor');

registerPlatformBpmnJSPlugin(tiltPropertiesExtensionModule);
registerBpmnJSModdleExtension(tiltModdleDescriptor);



//provide { config, resolver } as a `lintRules.${tabType}` plug-in
registerClientPlugin({ config, resolver }, 'lintRules.cloud-bpmn');
registerClientPlugin({ config, resolver }, 'lintRules.bpmn');

registerBpmnJSPlugin(tiltExtractor);

registerClientExtension(ExtractButton);