/**
 * Gets process definitions
 *
 * @return {ModdleElement} definitions
 */
 export function getDefinitions(canvas) {
  const rootElement = canvas.getRootElement();
  const businessObject = rootElement.businessObject;

  return businessObject.$parent;
}

module.exports = function (electronApp, menuState) {
  return [{
    label: 'Send a message to the console',
    accelerator: 'CommandOrControl+=',
    enabled: () => menuState.bpmn && menuState.platform === 'platform', 
    action: () => console.log('A custom menu entry was triggered')
  }, 
  {
    label: 'Print out Definitions',
    accelerator: 'CommandOrControl+-', 
    enabled: () => menuState.bpmn,
    action: () => console.log(getDefinitions())
  }]
}

getDefinitions.$inject = [ 'canvas' ];

module.exports = getDefinitions;
