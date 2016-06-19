var Immutable = require('immutable');
var prosemirror = require('prosemirror');
var schema = require("prosemirror/dist/schema-basic").schema

var EditorState = Immutable.Record({
    // Document Node
    doc: undefined, //prosemirror.Node()

    // Schema
    schema: schema,

    // Selection
    selection: null
});

EditorState.prototype.getDoc = function() {
    return this.get('doc');
};

EditorState.prototype.getSchema = function() {
    return this.get('schema');
};

EditorState.prototype.getSelection = function() {
    return this.get('selection');
};

module.exports = EditorState;
