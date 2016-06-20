var EditorState = require('./models/editorState');
var Editor = require('./editor');

var StyleUtils = require('./modifiers/style');
var EntityUtils = require('./modifiers/entity');
var HistoryUtils = require('./modifiers/history');

var createWidget = require('./widgets/createWidget');

module.exports              = Editor;
module.exports.EditorState  = EditorState;
module.exports.StyleUtils   = StyleUtils;
module.exports.EntityUtils  = EntityUtils;
module.exports.HistoryUtils = HistoryUtils;
module.exports.createWidget = createWidget;
