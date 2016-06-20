var prosemirror = require('prosemirror');

/**
 * Toggle an inline style.
 *
 * @param {EditorState} editorState
 * @param {String} type
 * @return {EditorState}
 */
function toggleInlineStyle(editorState, type) {
    var schema = editorState.getSchema();

    var mark = schema.marks[type];
    return editorState.set('transform', prosemirror.commands.toggleMark(mark));
}

/**
 * Change type of current block.
 *
 * @param {EditorState} editorState
 * @param {String} type
 * @param {Object} attrs
 * @return {EditorState}
 */
function toggleBlockType(editorState, type, attrs) {
    var schema = editorState.getSchema();

    var nodeType = schema.nodes[type];

    return editorState.set('transform', prosemirror.commands.setBlockType(nodeType, attrs));
}


module.exports = {
    toggleInlineStyle: toggleInlineStyle,
    toggleBlockType: toggleBlockType
};
