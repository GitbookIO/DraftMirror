var prosemirror = require('prosemirror');
var NodeRange = require('prosemirror/dist/model').NodeRange;
var findWrapping = require('prosemirror/dist/transform').findWrapping;
var liftTarget = require('prosemirror/dist/transform').liftTarget;

var DEFAULT_TYPE = 'paragraph';

/**
 * Toggle an inline style.
 *
 * @param {EditorState} editorState
 * @param {String} type
 * @param {Object} attrs
 * @return {EditorState}
 */
function toggleInlineStyle(editorState, type, attrs) {
    var schema = editorState.getSchema();
    var mark   = schema.marks[type];

    return editorState.applyTransform(prosemirror.commands.toggleMark(mark, attrs));
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

    var nodeType = editorState.getNodeType(type);
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
    var nodeType = editorState.getNodeType(type);
    return editorState.applyTransform(prosemirror.commands.wrapIn(nodeType, attrs));
}

/**
 * Lift the selected block, or the closest ancestor block of the
 * selection that can be lifted, out of its parent block.
 *
 * @param {EditorState} editorState
 * @return {EditorState}
 */
function unwrapBlock(editorState) {
    return editorState.applyTransform(prosemirror.commands.lift);
}

/**
 * Wraps the selection in a list with the given type and attributes
 *
 * @param {EditorState} editorState
 * @param {String} type
 * @param {Object} [attrs]
 * @return {EditorState}
 */
function wrapInList(editorState, type, attrs) {
    var nodeType = editorState.getNodeType(type);
    return editorState.applyTransform(prosemirror.commands.wrapInList(nodeType, attrs));
}

/**
 * @param {EditorState} editorState
 * @param {String} type
 * @param {Object} [attrs]
 * @return {Boolean} True if the current position can be wrapped with
 * a block of given type
 */
function canWrap(editorState, type, attrs) {
    var nodeType = editorState.getNodeType(type);

    // Adapted from
    // https://github.com/ProseMirror/prosemirror/blob/master/src/commands/index.js#L468
    var selection = editorState.getSelection();
    if (!selection) return false;

    var range = selection.$from.blockRange(selection.$to);
    var wrapping = range && findWrapping(range, nodeType, attrs);
    return !!wrapping;
}


/**
 * @param {EditorState} editorState
 * @param {String} type
 * @param {Object} [attrs]
 * @return {Boolean} True if the current position can be wrapped with
 * a list of given type
 */
function canWrapInList(editorState, type, attrs) {
    var nodeType = editorState.getNodeType(type);

    // Adapted from
    // https://github.com/ProseMirror/prosemirror/blob/master/src/commands-list/index.js#L13
    var selection = editorState.getSelection();
    if (!selection) return false;

    var $from = selection.$from;
    var $to = selection.$to;
    var range = $from.blockRange($to);

    var outerRange = range;
    // This is at the top of an existing list item
    if (range.depth >= 2
        && $from.node(range.depth - 1).type.compatibleContent(nodeType)
        && range.startIndex == 0) {
        // Don't do anything if this is the top of the list
        if ($from.index(range.depth - 1) == 0) return false;
        var doc = editorState.getDoc();
        var $insert = doc.resolve(range.start - 2);
        outerRange = new NodeRange($insert, $insert, range.depth);
        if (range.endIndex < range.parent.childCount)
            range = new NodeRange($from, doc.resolve($to.end(range.depth)), range.depth);
    }
    var wrap = findWrapping(outerRange, nodeType, attrs, range);
    return !!wrap;
}

/**
 * @param {EditorState} editorState
 * @return {Boolean} True if the current position can be wrapped with
 * a block of given type
 */
function canUnwrap(editorState) {
    // Adapted from
    // https://github.com/ProseMirror/prosemirror/blob/master/src/commands/index.js#L223
    var selection = editorState.getSelection();
    if (!selection) return false;

    var range = selection.$from.blockRange(selection.$to);
    var target = range && liftTarget(range);
    return target != null;
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
    var from  = selection.from;
    var to    = selection.to;

    return doc.rangeHasMark(from, to, mark);
}

module.exports = {
    toggleInlineStyle:   toggleInlineStyle,
    toggleBlockType:     toggleBlockType,
    toggleBlockOrInline: toggleBlockOrInline,
    wrapBlock:           wrapBlock,
    wrapInList:          wrapInList,
    canWrap:             canWrap,
    canWrapInList:       canWrapInList,
    unwrapBlock:         unwrapBlock,
    canUnwrap:           canUnwrap,
    hasBlockType:        hasBlockType,
    hasInlineStyle:      hasInlineStyle
};
