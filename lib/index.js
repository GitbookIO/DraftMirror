var EditorState = require('./models/editorState');
var Editor = require('./editor');

var StyleUtils = require('./modifiers/style');
var EntityUtils = require('./modifiers/entity');

module.exports = Editor;
module.exports.EditorState = EditorState;
module.exports.StyleUtils = StyleUtils;
module.exports.EntityUtils = EntityUtils;