/**
 * @param {EditorState} editorState
 * @return {Node?} The closest node to selection
 */
function nodeAtSelection(selection) {
    if (!selection) {
        return null;
    } else {
        return selection.node || selection.$from.parent;
    }
}

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

/**
 * Remove a node at the selection
 * @param {EditorState} editorState
 * @param {Selection} selection
 */
function removeAt(editorState, selection) {
    return editorState.applyTransform(function (editor) {
        editor.tr.delete(selection.$from.pos, selection.$to.pos).apply();
    });
}

module.exports = {
    nodeAtSelection:       nodeAtSelection,
    removeAt:              removeAt,
    getText:               getText,
    getParentText:         getParentText
};
