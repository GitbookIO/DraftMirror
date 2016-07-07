var Editor      = require('./editor');

var EditorState = require('./models/editorState');
var Keymap      = require('./models/keymap');
var SelectionContext = require('./models/selectionContext');
var InputRule = require('./models/inputRule');

var StyleUtils     = require('./modifiers/style');
var EntityUtils    = require('./modifiers/entity');
var HistoryUtils   = require('./modifiers/history');
var SelectionUtils = require('./modifiers/selection');
var TableUtils     = require('./modifiers/table');
var CodeUtils      = require('./modifiers/code');
var ListUtils      = require('./modifiers/list');

var createWidget    = require('./widgets/createWidget');
var createDecorator = require('./decorators/createDecorator');

module.exports                  = Editor;
module.exports.EditorState      = EditorState;
module.exports.SelectionContext = SelectionContext;
module.exports.Keymap           = Keymap;
module.exports.InputRule        = InputRule;
module.exports.StyleUtils       = StyleUtils;
module.exports.EntityUtils      = EntityUtils;
module.exports.HistoryUtils     = HistoryUtils;
module.exports.SelectionUtils   = SelectionUtils;
module.exports.TableUtils       = TableUtils;
module.exports.CodeUtils        = CodeUtils;
module.exports.ListUtils        = ListUtils;
module.exports.createWidget     = createWidget;
module.exports.createDecorator  = createDecorator;
