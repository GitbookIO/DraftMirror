var prosemirror = require('prosemirror');

var DEFAULT_TYPE = 'paragraph';

/**
 * Toggle an inline style.
 *
 * @param {EditorState} editorState
 * @param {String} type
 * @return {EditorState}
 */
function toggleInlineStyle(editorState, type) {
    var schema = editorState.getSchema();
    var mark   = schema.marks[type];

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
function toggleBlockType(editorState, type, attrs, defaultType) {
    defaultType = defaultType || DEFAULT_TYPE;

    if (hasBlockType(editorState, type, attrs)) {
        type = defaultType;
    }

    var schema   = editorState.getSchema();
    var nodeType = schema.nodes[type];
    return editorState.set('transform', prosemirror.commands.setBlockType(nodeType, attrs));
}

/**
 * Test if selection has a block type
 *
 * @param {EditorState} editorState
 * @param {Sting} type
 * @param {Object} attrs
 * @return {Boolean}
 */
function hasBlockType(editorState, type, attrs) {
    var selection = editorState.getSelection();
    var schema = editorState.getSchema();

    if (!selection) {
        return false;
    }

    var nodeType = schema.nodes[type];
    var node     = selection.node;
    var $from    = selection.$from;
    var to       = selection.to;

    if (node) {
        return node.hasMarkup(nodeType, attrs);
    }

    return to <= $from.end() && $from.parent.hasMarkup(nodeType, attrs);
}

/**
 * Test if selection has an inline style
 * @param {EditorState} editorState
 * @param {Sting} type
 * @return {Boolean}
 */
function hasInlineStyle(editorState, type) {
    var selection = editorState.getSelection();
    var schema    = editorState.getSchema();
    var doc       = editorState.getDoc();

    if (!selection) {
        return false;
    }

    var mark  = schema.marks[type];
    var empty = selection.empty;
    var from  = selection.from;
    var to    = selection.to;

    return doc.rangeHasMark(from, to, mark);
}

module.exports = {
    toggleInlineStyle: toggleInlineStyle,
    toggleBlockType:   toggleBlockType,
    hasBlockType:      hasBlockType,
    hasInlineStyle:    hasInlineStyle
};
