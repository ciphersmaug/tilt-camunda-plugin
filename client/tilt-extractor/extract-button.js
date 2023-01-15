import React, { Fragment, PureComponent } from 'camunda-modeler-plugin-helpers/react';
import { Fill } from 'camunda-modeler-plugin-helpers/components';

import classNames from 'classnames';

export default class ExtractButton extends PureComponent {
  constructor(eventBus, bpmnRules, editorActions, canvas, commandStack, elementRegistry, modeling, config) {
    super();
    this.eventBus = eventBus;
    this.editorActions = editorActions;
    this.canvas = canvas;
    this.elementRegistry = elementRegistry;
    this.config = config;
    this._buttonRef = React.createRef();
  }
  createTiltObject(){
    alert("Hello World")
    debugger;

  }

  /**
   * render any React component you like to extend the existing
   * Camunda Modeler application UI
   */
  render() {
    // we can use fills to hook React components into certain places of the UI
    return <Fragment>
      <Fill slot="status-bar__app" group="1_tilt_save">
        <button
          ref={ this._buttonRef }
          className={ classNames('tilt-btn','btn') }
          onClick={ () =>  this.createTiltObject()}>
          Click to create a TILT object...
        </button>
      </Fill>
    </Fragment>;
  }
}

ExtractButton.$inject = [
  'eventBus', 'bpmnRules', 'editorActions', 'canvas', 'commandStack', 'elementRegistry', 'modeling','config'
];



  //async saveFile2(){
  //  navigator.clipboard.writeText("HELLO WORLD");
  //  alert("This is currently not available as it needs to be implemented.")
  //  return;
  //}
  //async saveFile(){
  //  try {
  //    // Show the file save dialog.
  //    const handle = await window.showSaveFilePicker();
  //    // Write to the file.
  //    const writable = await handle.createWritable();
  //    debugger;
  //    await writable.write("Hello World");
  //    await writable.close();
  //    return;
  //  } catch (err) {
  //    if (err.name !== 'AbortError') {
  //      console.error(err.name, err.message);
  //      return;
  //    }
  //  }
  //}