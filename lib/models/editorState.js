var Immutable = require('immutable');
var prosemirror = require('prosemirror');
var schema = require("prosemirror/dist/schema-basic").schema
var Node = require("prosemirror/dist/model/node").Node;

window.prosemirror = prosemirror;

var EditorState = Immutable.Record({
    // Document Node
    doc: Node.fromJSON(schema, { type: 'doc', content: [] }),

    // Selection
    selection: null,

    // Transformation to apply
    transform: null
});

EditorState.prototype.getDoc = function() {
    return this.get('doc');
};

EditorState.prototype.getSelection = function() {
    return this.get('selection');
};

EditorState.prototype.getTransform = function() {
    return this.get('transform');
};

EditorState.prototype.getSchema = function() {
    return this.getDoc().type.schema;
};

/**
 * Return content of document as JSON
 * @return {Object}
 */
EditorState.prototype.getContentAsJSON = function() {
    return this.getDoc().toJSON();
};

/**
 * Create an editor state from a document
 * @param {Node} doc
 * @return {EditorState}
 */
EditorState.createForNode = function(doc) {
    return new EditorState({
        doc: doc
    })
};

/**
 * Create an editor state from a JSON document
 * @param {Schema} schema
 * @param {Object} json
 * @return {EditorState}
 */
EditorState.createFromJSON = function(schema, json) {
    return EditorState.createForNode(Node.fromJSON(schema, json));
};

module.exports = EditorState;
