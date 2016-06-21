
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

/**
 * @param {EditorState} editorState
 * @return {Boolean} True if the editor has not changed
 */
function isClean(editorState) {
    return !canUndo(editorState);
}

module.exports = {
    undo:    undo,
    redo:    redo,
    isClean: isClean,
    canRedo: canRedo,
    canUndo: canUndo
};
