var StyleUtils = require('./style');

/**
 * Insert an entity
 * See https://github.com/ProseMirror/prosemirror/blob/e47d1275e949d7d3963455b3f0ca13cef58f006f/src/menu/menu.js#L386 for ability to insert
 *
 * @param {EditorState} editorState
 * @return {EditorState}
 */
function insertEntity(editorState, type, attrs) {
    var schema   = editorState.getSchema();
    var nodeType = schema.nodes[type];
    attrs        = attrs || {};

    return editorState.applyTransform(function(editor) {
        editor.tr.replaceSelection(nodeType.createAndFill(attrs)).apply();
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

module.exports = {
    insertEntity:        insertEntity,
    editEntity:          editEntity,
    removeEntity:        removeEntity,
    toggleBlockOrInline: toggleBlockOrInline
};
