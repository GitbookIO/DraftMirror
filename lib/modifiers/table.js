var tableCommands = require('prosemirror/dist/commands-table');
var schemaTable   = require('prosemirror/dist/schema-table');

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

    var nodeType = editorState.getNodeType(tableType);

    return editorState.applyTransform(function(pm) {
        pm.tr
            .replaceSelection(schemaTable.createTable(nodeType, +rows, +columns))
            .applyAndScroll()
    });
}

/**
 * Test if a transform can be applied
 */
function _canApplyTransform(editorState, fn) {
    var selection = editorState.getSelection();
    if (!selection) {
        return false;
    }

    return Boolean(
        fn({
            selection: selection
        }, false)
    );
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

    var nodeType = editorState.getNodeType(tableType);
    var $from    = selection.$from;

    for (var d = $from.depth; d >= 0; d--) {
        var index = $from.index(d);
        if ($from.node(d).canReplaceWith(index, index, nodeType)) {
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
    return canAddRowAfter(editorState);
}

/**
 * Test if can insert a column after the current one
 *
 * @param {EditorState} editorState
 * @return {Boolean}
 */
function canAddColumnAfter(editorState) {
    return _canApplyTransform(editorState, tableCommands.addColumnAfter);
}

/**
 * Add column after the current one
 * @param {EditorState} editorState
 * @return {EditorState}
 */
function addColumnAfter(editorState) {
    return editorState.applyTransform(
        tableCommands.addColumnAfter
    );
}


/**
 * Test if can insert a column after the current one
 *
 * @param {EditorState} editorState
 * @return {Boolean}
 */
function canAddColumnBefore(editorState) {
    return _canApplyTransform(editorState, tableCommands.addColumnBefore);
}

/**
 * Add column before the current one
 * @param {EditorState} editorState
 * @return {EditorState}
 */
function addColumnBefore(editorState) {
    return editorState.applyTransform(
        tableCommands.addColumnBefore
    );
}

/**
 * Add row after the current one
 * @param {EditorState} editorState
 * @return {EditorState}
 */
function addRowAfter(editorState) {
    return editorState.applyTransform(
        tableCommands.addRowAfter
    );
}

/**
 * Test if can insert a column after the current one
 *
 * @param {EditorState} editorState
 * @return {Boolean}
 */
function canAddRowAfter(editorState) {
    return _canApplyTransform(editorState, tableCommands.addRowAfter);
}

/**
 * Add row before the current one
 * @param {EditorState} editorState
 * @return {EditorState}
 */
function addRowBefore(editorState) {
    return editorState.applyTransform(
        tableCommands.addRowBefore
    );
}

/**
 * Test if can insert a column after the current one
 *
 * @param {EditorState} editorState
 * @return {Boolean}
 */
function canAddRowBefore(editorState) {
    return _canApplyTransform(editorState, tableCommands.addRowBefore);
}

module.exports = {
    createTable:        createTable,
    canInsertTable:     canInsertTable,
    canEditTable:       canEditTable,
    addColumnAfter:     addColumnAfter,
    canAddColumnAfter:  canAddColumnAfter,
    addColumnBefore:    addColumnBefore,
    canAddColumnBefore: canAddColumnBefore,
    addRowAfter:        addRowAfter,
    canAddRowAfter:     canAddRowAfter,
    addRowBefore:       addRowBefore,
    canAddRowBefore:    canAddRowBefore
};
