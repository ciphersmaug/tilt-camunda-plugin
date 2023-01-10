import React, { Fragment, PureComponent } from 'camunda-modeler-plugin-helpers/react';
import { Fill } from 'camunda-modeler-plugin-helpers/components';

import classNames from 'classnames';

export default class ExtractButton extends PureComponent {
  constructor(props) {
    super(props);
    this._buttonRef = React.createRef();
  }

  saveFile(){
    window.showSaveFilePicker()
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
          onClick={ () =>  this.saveFile()}>
          TILT
        </button>
      </Fill>
    </Fragment>;
  }
}

ExtractButton.$inject = [
  'propertiesPanel',
  'injector'
];