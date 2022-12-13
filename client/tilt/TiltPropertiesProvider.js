// Import your custom property entries.
// The entry is a text input field with logic attached to create,
// update and delete the "spell" property.
import metaProps from './parts/MetaProps';

import { is } from 'bpmn-js/lib/util/ModelUtil';

const LOW_PRIORITY = 500;


/**
 * A provider with a `#getGroups(element)` method
 * that exposes groups for a diagram element.
 *
 * @param {PropertiesPanel} propertiesPanel
 * @param {Function} translate
 */
export default function TiltPropertiesProvider(propertiesPanel, translate) {

  // API ////////

  /**
   * Return the groups provided for the given element.
   *
   * @param {DiagramElement} element
   *
   * @return {(Object[]) => (Object[])} groups middleware
   */
  this.getGroups = function(element) {

    /**
     * We return a middleware that modifies
     * the existing groups.
     *
     * @param {Object[]} groups
     *
     * @return {Object[]} modified groups
     */
    return function(groups) {
      if(is(element,'bpmn:Process')){
        groups.push(createMetaGroup(element, translate));
      }

      return groups;
    }
  };


  // registration ////////

  // Register our custom tilt properties provider.
  // Use a lower priority to ensure it is loaded after
  // the basic BPMN properties.
  propertiesPanel.registerProvider(LOW_PRIORITY, this);
}

TiltPropertiesProvider.$inject = [ 'propertiesPanel', 'translate' ];

// Create the tilt-meta group
function createMetaGroup(element, translate) {

  // Create a group called "TILT meta properties".
  const metaGroup = {
    id:"tiltMeta",
    label: translate("TILT meta properties"),
    entries: metaProps(element)
  };
  return metaGroup
}