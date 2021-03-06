var Immutable = require('immutable');
var normalizeNewline = require('normalize-newline');
var schema = require('prosemirror/dist/schema-basic').schema;
var Node = require('prosemirror/dist/model/node').Node;

var ID = 0;

var EditorState = Immutable.Record({
    id:         0,

    doc:        Node.fromJSON(schema, { type: 'doc', content: [] }),

    // Current selection (editor.selection)
    selection:  null,

    // Active marks (but not marks at current position)
    activeMarks: Immutable.List(),

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

EditorState.prototype.getActiveMarks = function() {
    return this.get('activeMarks');
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
    separator = separator || '\n';

    var text = '';
    var firstBlock = true;

    doc.nodesBetween(0, doc.nodeSize - 2, function(node, pos) {
        if (node.isText) {
            text += node.text;
        } else if (node.isBlock && !firstBlock) {
            text += separator;
        }

        firstBlock = false;
    });

    return text;
};

/**
 * Focus the editor (does not actually change the state)
 */
EditorState.prototype.focus = function() {
    return this.applyTransform(function (pm) {
        pm.focus();
    });
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
 * Create a raw editor state from a text, each line gets its own block.
 * @param {String} text
 * @return {EditorState}
 */
EditorState.createForText = function(schema, text, docType, textType, styleType, brType) {
    docType   = docType || 'doc';
    textType  = textType || 'unstyled';
    styleType = styleType || 'text';
    brType    = brType || 'hard_break';

    text = normalizeNewline(text);
    var lines = text.split(/\n/);

    var blocks = lines.map(function(line) {
        return {
            type: textType,
            'content': line? [
                line? {
                    type: styleType,
                    text: line
                } : { type: brType }
            ] : []
        };
    });

    return EditorState.createFromJSON(schema, {
        'type': docType,
        'content': blocks
    });
};

/**
 * @param {?EditorState} previousState
 * @param {?EditorState} newState
 * @param {Boolean} [ignoreTransforms=true]
 * @return {Boolean} True if actual content changed
 */
EditorState.contentChanged = function(previousState, newState, ignoreTransforms) {
    ignoreTransforms = ignoreTransforms === undefined ? true : ignoreTransforms;
    if (previousState === newState) {
        return false;
    } else if (!previousState || !newState) {
        return true;
    } else {
        var differentTransforms = previousState.getTransforms() !== newState.getTransforms();
        var differentDoc = previousState.getDoc() !== newState.getDoc();
        return (differentDoc
                || (!ignoreTransforms && differentTransforms));
    }
};

module.exports = EditorState;
