
/**
 * Insert an image
 *
 * @param {EditorState} editorState
 * @return {EditorState}
 */
function insertImage(editorState, attrs) {

    return editorState;
}

/**
 * Insert an horizontal rule
 *
 * @param {EditorState} editorState
 * @return {EditorState}
 */
function insertHR(editorState) {
    var schema   = editorState.getSchema();
    var nodeType = schema.nodes['horizontal_rule'];
    var attrs = {};

    return editorState.applyTransform(function(editor) {
        editor.tr.replaceSelection(nodeType.createAndFill(attrs)).apply()
    });
}

module.exports = {
    insertImage: insertImage,
    insertHR: insertHR
};
