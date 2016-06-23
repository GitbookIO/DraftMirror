var tableCommands = require('prosemirror/dist/commands-table');

/**
 * Create a table by replacing selection.
 *
 * @param {EditorState} editorState
 * @param {String} tableType
 * @param {Number} rows
 * @param {Number} columns
 * @return {EditorState}
 */
function createTable(editorState, tableType, rows, columns) {
    tableType = tableType || 'table';
    rows    = rows || 2;
    columns = columns || 2;

    return editorState.applyTransform(function(pm) {
        pm.tr
            .replaceSelection(createTable(tableType, +rows, +cols))
            .applyAndScroll()
    });
}

/**
 * Test if a table can be inserted instead
 * of the current selection.
 *
 * @param {EditorState} editorState
 * @return {Boolean}
 */
function canInsertTable(editorState, tableType) {
    tableType = tableType || 'table';

    var selection = editorState.getSelection();
    if (!selection) {
        return false;
    }

    var $from = selection.$from;

    for (var d = $from.depth; d >= 0; d--) {
        var index = $from.index(d);
        if ($from.node(d).canReplaceWith(index, index, tableType)) {
            return true;
        }
    }
    return false;
}

/**
 * Test if selection is inside a table.
 * It can be used to display the table menu only when required.
 *
 * @param {EditorState} editorState
 * @return {Boolean}
 */
function canEditTable(editorState) {
    // todo
    return true;
}

/**
 * Add column after the current one
 * @param {EditorState} editorState
 * @return {EditorState}
 */
function addColumnAfter(editorState) {
    return editorState.applyTransform(
        tableCommands.addColumnAfter()
    );
}

/**
 * Add column before the current one
 * @param {EditorState} editorState
 * @return {EditorState}
 */
function addColumnBefore(editorState) {
    return editorState.applyTransform(
        tableCommands.addColumnBefore()
    );
}

/**
 * Add row after the current one
 * @param {EditorState} editorState
 * @return {EditorState}
 */
function addRowAfter(editorState) {
    return editorState.applyTransform(
        tableCommands.addRowAfter()
    );
}

/**
 * Add row before the current one
 * @param {EditorState} editorState
 * @return {EditorState}
 */
function addRowBefore(editorState) {
    return editorState.applyTransform(
        tableCommands.addRowBefore()
    );
}

module.exports = {
    createTable:     createTable,
    canInsertTable:  canInsertTable,
    canEditTable:    canEditTable,
    addColumnAfter:  addColumnAfter,
    addColumnBefore: addColumnBefore,
    addRowAfter:     addRowAfter,
    addRowBefore:    addRowBefore
};
