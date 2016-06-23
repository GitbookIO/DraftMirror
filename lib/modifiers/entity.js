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
    toggleBlockOrInline: toggleBlockOrInline
};
