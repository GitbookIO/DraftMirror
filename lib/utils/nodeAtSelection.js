/**
 * @param {EditorState} editorState
 * @return {Node?} The closest node to selection
 */
function nodeAtSelection(selection) {
    if (!selection) {
        return null;
    }

    var maybeNode = selection.node;
    if (maybeNode) return maybeNode;

    return selection.$from.parent;
}

module.exports = nodeAtSelection;
