var SelectionContext = require('../models/selectionContext');

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

    return new SelectionContext({
        node: node ? {
            type: node.type.name,
            attrs: node.attrs
        } : undefined,
        marks: marksAtSelection(editorState, selection),
        selection: selection
    });
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
 * @return {EditorState}
 */
function removeAt(editorState, selection) {
    return editorState.applyTransform(function (editor) {
        editor.tr.delete(selection.$from.pos, selection.$to.pos).apply();
    });
}

/**
 * Remove the selected content
 * @param {EditorState} editorState
 * @param {Selection} selection
 * @return {EditorState}
 */
function remove(editorState, selection) {
    return editorState.applyTransform(function (editor) {
        editor.tr.deleteSelection().apply();
    });
}

/**
 * Remove the selected content
 * @param {EditorState} editorState
 * @param {String} text
 * @return {EditorState}
 */
function replaceWithText(editorState, text) {
    return editorState.applyTransform(function (editor) {
        editor.tr.typeText(text).apply();
    });
}

/**
 * Surround the selection with some text before and after
 * @param {EditorState} editorState
 * @param {String} beforeText
 * @param {String} afterText
 * @return {EditorState}
 */
function surroundWithText(editorState, beforeText, afterText) {
    return editorState.applyTransform(function (editor) {
        var selection = editor.selection;
        // After before before, to avoid messing up indexes
        if (afterText) editor.tr.insertText(selection.to, afterText).apply();
        if (beforeText) editor.tr.insertText(selection.from, beforeText).apply();

        // Inserting at the end of the selection expand the selection
        editor.setTextSelection(selection.from + beforeText.length, selection.to + beforeText.length);
    });
}

/**
 * Move cursor at the end of the document
 * @param {EditorState} editorState
 * @return {EditorState}
 */
// TODO There might be a cleaner implementation...
// Worth looking at this?
// https://github.com/ProseMirror/prosemirror/blob/d291573df5973ad78882dc0de46288c832d17bff/src/edit/input.js#L151
function moveCursorAtEnd(editorState) {
    return editorState.applyTransform(function (editor) {
        // Find last selectable position
        var node;
        var pos = editor.doc.nodeSize - 2; // end of doc
        while (pos > 0) {
            node = editor.doc.nodeAt(pos);

            if (node && node.type.selectable) {
                editor.setNodeSelection(pos);
                break;

            } else if (node && node.type.isText) {
                // For some reasons, by the time nodeAt returns a text
                // node, we are already one pos too far, so use "pos + 1"
                editor.setTextSelection(pos + 1);
                break;

            } else {
                pos = pos - 1;
            }
        }
    });
}

module.exports = {
    contextAtSelection: contextAtSelection,
    getParentText:      getParentText,
    getText:            getText,
    moveCursorAtEnd:    moveCursorAtEnd,
    nodeAtSelection:    nodeAtSelection,
    remove:             remove,
    removeAt:           removeAt,
    replaceWithText:    replaceWithText,
    surroundWithText:   surroundWithText
};
