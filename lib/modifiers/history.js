
/**
 * Undo one history event
 *
 * @param {EditorState} editorState
 * @return {EditorState}
 */
function undo(editorState) {
    return editorState.applyTransform(function(editor) {
        editor.history.undo();
    });
}

/**
 * Redo one history event
 *
 * @param {EditorState} editorState
 * @return {EditorState}
 */
function redo(editorState) {
    return editorState.applyTransform(function(editor) {
        editor.history.redo();
    });
}

/**
 * Is there an operation to undo
 *
 * @param {EditorState} editorState
 * @return {Boolean}
 */
function canUndo(editorState) {
    var history = editorState.getHistory();
    return Boolean(history && history.undoDepth > 0);
}

/**
 * Is there an operation to redo
 *
 * @param {EditorState} editorState
 * @return {Boolean}
 */
function canRedo(editorState) {
    var history = editorState.getHistory();
    return Boolean(history && history.redoDepth > 0);
}

module.exports = {
    undo:    undo,
    redo:    redo,
    canRedo: canRedo,
    canUndo: canUndo
};
