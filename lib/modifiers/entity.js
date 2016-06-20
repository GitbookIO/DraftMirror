
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
 * Insert an image
 *
 * @param {EditorState} editorState
 * @return {EditorState}
 */
function insertImage(editorState, attrs) {
    return insertEntity(editorState, 'image', attrs);
}

/**
 * Insert an horizontal rule
 *
 * @param {EditorState} editorState
 * @return {EditorState}
 */
function insertHR(editorState) {
    return insertEntity(editorState, 'horizontal_rule');
}

module.exports = {
    insertImage: insertImage,
    insertHR: insertHR
};
