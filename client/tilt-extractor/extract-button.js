import React, { Fragment, PureComponent } from 'camunda-modeler-plugin-helpers/react';
import { Fill } from 'camunda-modeler-plugin-helpers/components';

import classNames from 'classnames';
import { saveFile } from './extractor';

export default class ExtractButton extends PureComponent {
  constructor() {
    super();
    this._buttonRef = React.createRef();
  }

  render() {
    // we can use fills to hook React components into certain places of the UI
    return <Fragment>
      <Fill slot="status-bar__file" group="1_tilt_save">
        <button
          ref={ this._buttonRef }
          className={ classNames('tilt-btn','btn') }
          onClick={ () =>  saveFile(window.bpmnjsInjector.get("canvas"))}>
          TILT
        </button>
      </Fill>
    </Fragment>;
  }
}