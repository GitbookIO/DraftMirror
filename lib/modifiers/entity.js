var is = require('is');

var StyleUtils = require('./style');

/**
 * Create content from a string
 * @param {EditorState} editorState
 * @param {String|Node|undefined} content
 * @return {?Node}
 */
function _createContent(editorState, content) {
    var schema   = editorState.getSchema();
    if (is.string(content)) {
        content = schema.text(content);
    }

    return content;
}

/**
 * Insert an entity
 * See https://github.com/ProseMirror/prosemirror/blob/e47d1275e949d7d3963455b3f0ca13cef58f006f/src/menu/menu.js#L386 for ability to insert
 *
 * @param {EditorState} editorState
 * @param {String} type
 * @param {Object} attrs
 * @param {String|Node|undefined} content
 * @return {EditorState}
 */
function insertEntity(editorState, type, attrs, content) {
    var schema   = editorState.getSchema();
    var nodeType = schema.nodes[type];
    attrs        = attrs || {};

    return editorState.applyTransform(function(editor) {
        content = _createContent(editorState, content);

        var newNode = nodeType.createAndFill(attrs, content);
        editor.tr.replaceSelection(newNode).apply();
    });
}

/**
 * Edit entity attributes at given position
 * @param {EditorState} editorState
 * @param {Number} position
 * @param {Object} attrs
 * @param {String} [type] To edit the closest parent entity with given type
 * @return {EditorState}
 */
function editEntity(editorState, position, attrs, type) {
    var parentPosition = position;
    if (type) {
        parentPosition = _positionForParentType(editorState, editorState.getNodeType(type), position);
    }
    return editorState.applyTransform(function(editor) {
        editor.tr.setNodeType(parentPosition, undefined, attrs).apply();
    });
}

/**
 * Returns the position of the closest parent node with given type.
 * @param {EditorState} editorState
 * @param {Node.Type} nodeType
 * @param {Number} position
 * @return {Number}
 */
function _positionForParentType(editorState, nodeType, position) {
    var doc = editorState.getDoc();
    var node = doc.nodeAt(position);
    if (node === null) { // happens if we are at the last token of a node
        node = doc.nodeAt(position - 1);
    }
    if (node.type === nodeType) {
        return position;
    } else {
        // Search the parent instead
        var resolved = doc.resolve(position);
        var parentPosition = resolved.pos - resolved.parentOffset - 1;
        return _positionForParentType(editorState, nodeType, parentPosition);
    }
}

/**
 * Remove the whole entity at point.
 * @param {EditorState} editorState
 * @param {String} [type] To remove the closest parent entity with given type
 */
function removeEntity(editorState, type) {
    var position = editorState.getSelection().head;
    if (type) {
        position = _positionForParentType(editorState, editorState.getNodeType(type), position);
    }

    var doc = editorState.getDoc();
    var node = doc.nodeAt(position);
    var start = position;
    var end = start + node.nodeSize;

    return editorState.applyTransform(function(editor) {
        editor.tr.delete(start, end).apply();
    });
}

/**
 * Change type fo current node or insert an entity in the middle
 *
 * @param {EditorState} editorState
 * @param {String} opts.inlineEntity
 * @param {String} opts.blockType
 * @param {Function} opts.attrs
 * @return {EditorState}
 */
function toggleBlockOrInline(editorState, opts) {
    var selection    = editorState.getSelection();
    var hasSelection = !selection.empty;
    var attrs        = opts.attrs? opts.attrs() : {};

    if (hasSelection) {
        return insertEntity(editorState, opts.inlineType, attrs);
    } else {
        return StyleUtils.toggleBlockType(editorState, opts.blockType, attrs, opts.defaultBlockType);
    }
}

/**
 * @param {EditorState} editorState
 */
function appendEntityAndFocus(editorState, type, attrs, content) {
    var schema   = editorState.getSchema();
    var nodeType = schema.nodes[type];
    attrs        = attrs || {};

    return editorState.applyTransform(function(editor) {
        content = _createContent(editorState, content);
        var end = editorState.getDoc().nodeSize - 2; // at the end of the doc

        editor.tr.insert(end, nodeType.createAndFill(attrs, content)).apply();

        // end + 1 to be inside the created node
        editor.setTextSelection(end + 1);
        editor.scrollIntoView(end + 1);
    });
}

module.exports = {
    insertEntity:        insertEntity,
    appendEntityAndFocus: appendEntityAndFocus,
    editEntity:          editEntity,
    removeEntity:        removeEntity,
    toggleBlockOrInline: toggleBlockOrInline
};
