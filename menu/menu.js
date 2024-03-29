'use strict';

module.exports = function(electronApp, menuState) {
  return [
    {
      label: 'Generate TILT document',
      accelerator: 'CommandOrControl+T',
      enabled: function() {
        return true;
      },
      action: function() {
        electronApp.emit('menu:action', 'extractTiltFromBpmn');
      }
    },
    {
      label: 'Toggle TILT overlay',
      accelerator: 'CommandOrControl+O',
      enabled: function() {
        return true;
      },
      action: function() {
        electronApp.emit('menu:action', 'toggleTiltIcons');
      }
    }];
};