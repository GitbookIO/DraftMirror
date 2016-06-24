/**
 * @param {Selection} selection
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
 * @param {EditorState} editorState
 * @param {Selection} selection
 * @return {Array<Marks>} The marks surrounding the selection
 */
function marksAtSelection(editorState, selection) {
    if (!selection) return [];

    var head = selection.head;
    if (!head) return [];

    return editorState.getDoc().marksAt(head);
}

/**
 * @param {EditorState} editorState
 * @param {Selection} selection
 * @return {Context} contextual information about the selection
 */
function contextAtSelection(editorState, selection) {
    var node = nodeAtSelection(selection);

    return {
        node: node ? {
            type: node.type.name,
            attrs: node.attrs
        } : undefined,
        marks: marksAtSelection(editorState, selection),
        selection: selection
    };
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
    contextAtSelection:    contextAtSelection,
    removeAt:              removeAt,
    getText:               getText,
    getParentText:         getParentText
};
