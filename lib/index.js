var EditorState = require('./models/editorState');
var Keymap      = require('./models/keymap');
var Editor      = require('./editor');

var StyleUtils     = require('./modifiers/style');
var EntityUtils    = require('./modifiers/entity');
var HistoryUtils   = require('./modifiers/history');
var SelectionUtils = require('./modifiers/selection');
var TableUtils     = require('./modifiers/table');

var createWidget    = require('./widgets/createWidget');
var createDecorator = require('./decorators/createDecorator');

module.exports                 = Editor;
module.exports.EditorState     = EditorState;
module.exports.Keymap          = Keymap;
module.exports.StyleUtils      = StyleUtils;
module.exports.EntityUtils     = EntityUtils;
module.exports.HistoryUtils    = HistoryUtils;
module.exports.SelectionUtils  = SelectionUtils;
module.exports.TableUtils      = TableUtils;
module.exports.createWidget    = createWidget;
module.exports.createDecorator = createDecorator;
