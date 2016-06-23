var prosemirror = require('prosemirror');
var findWrapping = require('prosemirror/dist/transform').findWrapping;

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

    return editorState.applyTransform(prosemirror.commands.toggleMark(mark));
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
    return editorState.applyTransform(prosemirror.commands.setBlockType(nodeType, attrs));
}

/**
 * Toggle current selection to inline style, or toggle current
 * block if no selection.
 *
 * @param {EditorState} editorState
 * @param {String} opts.inlineStyle
 * @param {String} opts.blockType
 * @param {Object} [opts.attrs]
 * @param {String} [opts.defaultBlockType='paragraph']
 * @return {EditorState}
 */
function toggleBlockOrInline(editorState, opts) {
    var hasSelection = !editorState.getSelection().empty;
    if (hasSelection) {
        return toggleInlineStyle(editorState, opts.inlineStyle);
    } else {
        return toggleBlockType(editorState, opts.blockType, opts.attrs, opts.defaultBlockType);
    }
}


/**
 * Toggle current selection to inline style, or toggle current
 * block if no selection.
 *
 * @param {EditorState} editorState
 * @param {String} type
 * @param {Object} [attrs]
 * @return {EditorState}
 */
function wrapBlock(editorState, type, attrs) {
    var schema   = editorState.getSchema();
    var nodeType = schema.nodes[type];

    return editorState.applyTransform(prosemirror.commands.wrapIn(nodeType, attrs));
}

/**
 * @param {EditorState} editorState
 * @param {String} type
 * @return {Boolean} True if the current position can be wrapped with
 * a block of given type
 */
function canWrap(editorState, type) {
    var schema   = editorState.getSchema();
    var nodeType = schema.nodes[type];

    // https://github.com/ProseMirror/prosemirror/blob/master/src/commands/index.js#L468
    var selection = editorState.getSelection();
    if (!selection) return false;

    var range = selection.$from.blockRange(selection.$to);
    var wrapping = range && findWrapping(range, nodeType);
    return Boolean(wrapping);
}
/**
 * Test if selection has a block type
 *
 * @param {EditorState} editorState
 * @param {String} type
 * @param {Object} [attrs]
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
    toggleInlineStyle:   toggleInlineStyle,
    toggleBlockType:     toggleBlockType,
    toggleBlockOrInline: toggleBlockOrInline,
    wrapBlock:           wrapBlock,
    canWrap:             canWrap,
    hasBlockType:        hasBlockType,
    hasInlineStyle:      hasInlineStyle
};
