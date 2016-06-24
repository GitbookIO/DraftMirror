

/**
 * Get text selected
 *
 * @param {EditorState} editorState
 * @return {String}
 */
function getText(editorState) {
    var selection = editorState.getSelection();

    return editorState.getDoc()
        .textBetween(selection.$from.pos, selection.$to.pos);
}

/**
 * Get text of parent node
 *
 * @param {EditorState} editorState
 * @return {String}
 */
function getParentText(editorState) {
    var selection    = editorState.getSelection();
    var node  = selection.node || selection.$from.parent;

    var startParent = selection.$from.pos - selection.$from.parentOffset;
    var endParent = startParent + node.nodeSize;

    return editorState.getDoc()
        .textBetween(startParent, endParent);
}

module.exports = {
    getText:       getText,
    getParentText: getParentText
};
