const { saveFile } = require("./extractor");

function ExtractorMenu(canvas, editorActions) {
  editorActions.register({
    extractTiltFromBpmn: function() {
      saveFile(canvas)
    }
  });
}

ExtractorMenu.$inject = [ 'canvas', 'editorActions' ];

module.exports = {
  __init__: [ 'ExtractorMenu' ],
  ExtractorMenu: [ 'type', ExtractorMenu ]
};