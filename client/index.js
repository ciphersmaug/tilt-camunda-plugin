import {
  registerPlatformBpmnJSPlugin, registerBpmnJSModdleExtension, registerClientPlugin, registerBpmnJSPlugin, registerClientExtension
} from 'camunda-modeler-plugin-helpers';
import { config, resolver } from '../.bpmnlintrc';

import tiltPropertiesExtensionModule from './tilt-properties';
import tiltModdleDescriptor from "./descriptors/tilt";

import ExtractButton from './tilt-extractor/extract-button';
import tiltOverlayProvider from './tilt-overlay'
import Assistant from './modeling-assistant';

import ExtractorMenu from './tilt-extractor/extractor-menu';

registerPlatformBpmnJSPlugin(tiltPropertiesExtensionModule);
registerBpmnJSModdleExtension(tiltModdleDescriptor);
registerPlatformBpmnJSPlugin(tiltOverlayProvider);
registerPlatformBpmnJSPlugin(Assistant)


//provide { config, resolver } as a `lintRules.${tabType}` plug-in
registerClientPlugin({ config, resolver }, 'lintRules.cloud-bpmn');
registerClientPlugin({ config, resolver }, 'lintRules.bpmn');

registerBpmnJSPlugin(ExtractorMenu);
registerClientExtension(ExtractButton);