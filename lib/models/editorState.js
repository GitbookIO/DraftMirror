var Immutable = require('immutable');
var prosemirror = require('prosemirror');
var schema = require("prosemirror/dist/schema-basic").schema;
var Node = require("prosemirror/dist/model/node").Node;

window.prosemirror = prosemirror;

var EditorState = Immutable.Record({
    doc:       Node.fromJSON(schema, { type: 'doc', content: [] }),
    selection: null,
    history:   null,

    // List of transformation to apply in next redering
    transforms:  Immutable.List()
});

EditorState.prototype.getDoc = function() {
    return this.get('doc');
};

EditorState.prototype.getSelection = function() {
    return this.get('selection');
};

EditorState.prototype.getHistory = function() {
    return this.get('history');
};

EditorState.prototype.getTransform = function() {
    return this.get('transform');
};

EditorState.prototype.getTransforms = function() {
    return this.get('transforms');
};

EditorState.prototype.getSchema = function() {
    return this.getDoc().type.schema;
};

EditorState.prototype.applyTransform = function(fn) {
    var transforms = this.getTransforms();
    transforms = transforms.push(fn);

    return this.set('transforms', transforms);
};

/**
 * Return content of document as JSON
 * @return {Object}
 */
EditorState.prototype.getContentAsJSON = function() {
    return this.getDoc().toJSON();
};

/**
 * Return content of document as plain text
 * @return {String}
 */
EditorState.prototype.getContentAsPlainText = function() {
    return this.getDoc().toString();
};

/**
 * Create an editor state from a document
 * @param {Node} doc
 * @return {EditorState}
 */
EditorState.createForNode = function(doc) {
    return new EditorState({
        doc: doc
    });
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
