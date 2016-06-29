var Immutable = require('immutable');
var schema = require('prosemirror/dist/schema-basic').schema;
var Node = require('prosemirror/dist/model/node').Node;

var ID = 0;

var EditorState = Immutable.Record({
    id:         0,

    doc:        Node.fromJSON(schema, { type: 'doc', content: [] }),

    // Current selection (editor.selection)
    selection:  null,

    // Current history of editor (editor.history)
    history:    null,

    // First version when editor is set
    baseVersion: null,

    // List of transformation to apply in next redering
    transforms:  Immutable.List()
}, 'EditorState');

EditorState.prototype.getID = function() {
    return this.get('id');
};

EditorState.prototype.getDoc = function() {
    return this.get('doc');
};

EditorState.prototype.getSelection = function() {
    return this.get('selection');
};

EditorState.prototype.getHistory = function() {
    return this.get('history');
};

EditorState.prototype.getBaseVersion = function() {
    return this.get('baseVersion');
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

/**
 * Set the history
 *
 * @param {prosemirror.History} newHistory
 * @return {EditorState}
 */
EditorState.prototype.setHistory = function(newHistory) {
    var hadHistory = Boolean(this.getHistory());

    return this.merge({
        history:     newHistory,
        baseVersion: hadHistory? this.getBaseVersion() : newHistory.getVersion()
    });
};

/**
 * Push a transformation to be applied
 *
 * @param {Function} transform(editor)
 * @return {EditorState}
 */
EditorState.prototype.applyTransform = function(fn) {
    var transforms = this.getTransforms();
    transforms = transforms.push(fn);

    return this.set('transforms', transforms);
};

/**
 * Test if editorState has been modified
 *
 * @return {EditorState}
 */
EditorState.prototype.isClean = function() {
    var baseVersion = this.getBaseVersion();
    var history = this.getHistory();

    return Boolean(
        !history || history.isAtVersion(baseVersion)
    );
};

/**
 * Return content of document as JSON
 * @return {Object}
 */
EditorState.prototype.getContentAsJSON = function() {
    return this.getDoc().toJSON();
};

/**
 * Return the MarkType corresponding to given type string
 * @param {String} type
 * @return nodeType
 */
EditorState.prototype.getMarkType = function(type) {
    return this.getSchema().marks[type];
};

/**
 * Return the NodeType corresponding to given type string
 * @param {String} type
 * @return nodeType
 */
EditorState.prototype.getNodeType = function(type) {
    return this.getSchema().nodes[type];
};

/**
 * Return content of document as plain text
 * @param {String} separator
 * @return {String}
 */
EditorState.prototype.getContentAsPlainText = function(separator) {
    var doc = this.getDoc();
    // todo: adapt for real document (only work in rawMode currently)

    var result = [];
    doc.forEach(function(node, pos, offset) {
        result.push(node.textContent);
    });

    return result.join(separator) || '';
};

/**
 * Create an editor state
 * @param {Object} props
 * @return {EditorState}
 */
EditorState.create = function(props) {
    props.id = ++ID;
    return new EditorState(props);
};

/**
 * Create an editor state from a document
 * @param {Node} doc
 * @return {EditorState}
 */
EditorState.createForNode = function(doc) {
    return EditorState.create({
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

/**
 * @param {?EditorState} previousState
 * @param {?EditorState} newState
 * @return {Boolean} True if actual content changed
 */
EditorState.contentChanged = function(previousState, newState) {
    if (previousState === newState) {
        return false;
    } else if (!previousState || !newState) {
        return true;
    } else {
        var differentTransforms = previousState.getTransforms() !== newState.getTransforms();
        var differentDoc = previousState.getDoc() !== newState.getDoc();
        return (differentDoc || differentTransforms);
    }
};

module.exports = EditorState;
