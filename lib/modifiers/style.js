var NodeRange    = require('prosemirror/dist/model').NodeRange;
var findWrapping = require('prosemirror/dist/transform').findWrapping;
var liftTarget   = require('prosemirror/dist/transform').liftTarget;
var commands     = require('prosemirror/dist/commands');
var listCommands = require('prosemirror/dist/commands-list');

var DEFAULT_TYPE = 'paragraph';

/**
 * Toggle an inline style on cursor or selection.
 *
 * @param {EditorState} editorState
 * @param {String} type
 * @param {Object} attrs
 * @return {EditorState}
 */
function toggleInlineStyle(editorState, type, attrs) {
    var mark   = editorState.getMarkType(type);
    return editorState.applyTransform(commands.toggleMark(mark, attrs));
}

/**
 * Change type of current block.
 *
 * @param {EditorState} editorState
 * @param {String} type
 * @param {Object} attrs
 * @return {EditorState}
 */
function toggleBlockType(editorState, type, attrs, defaultType, defaultAttrs) {
    defaultType = defaultType || DEFAULT_TYPE;

    if (hasBlockType(editorState, type, attrs)) {
        type = defaultType;
        attrs = defaultAttrs;
    }

    var nodeType = editorState.getNodeType(type);
    return editorState.applyTransform(commands.setBlockType(nodeType, attrs));
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
    return editorState.applyTransform(commands.wrapIn(nodeType, attrs));
}

/**
 * Lift the selected block, or the closest ancestor block of the
 * selection that can be lifted, out of its parent block.
 *
 * @param {EditorState} editorState
 * @return {EditorState}
 */
function unwrapBlock(editorState) {
    return editorState.applyTransform(commands.lift);
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
    return editorState.applyTransform(listCommands.wrapInList(nodeType, attrs));
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
 * @param {String} type
 * @return {Boolean}
 */
function hasInlineStyle(editorState, type) {
    var mark  = editorState.getMarkType(type);
    var selection = editorState.getSelection();

    if (!selection) {
        return false;
    } else if (selection.empty) {
        var activeMarks = editorState.getActiveMarks().toArray();
        return Boolean(mark.isInSet(activeMarks));
    } else {
        var from  = selection.from;
        var to    = selection.to;
        var doc   = editorState.getDoc();

        return doc.rangeHasMark(from, to, mark);
    }
}

/**
 * Get delimiter for a mark at a position
 * @param {EditorState} editorState
 * @param {String} type
 * @param {Number} pos
 * @return {Object|null} {from, to}
 */
function getMarkDelimiter(editorState, type, pos) {
    var doc      = editorState.getDoc();
    var markType = editorState.getMarkType(type);
    var $pos     = doc.resolve(pos);
    var marks    = doc.marksAt(pos);

    if (!markType.isInSet(marks)) {
        return null;
    }

    return {
        from: pos - $pos.nodeBefore.nodeSize,
        to:   pos + $pos.nodeAfter.nodeSize
    };
}

/**
 * Replace an inline mark (only if existing) for a specific type
 *
 * @param {EditorState} editorState
 * @param {SelectionContext} context
 * @param {String} type
 * @param {Object} attrs
 * @return {EditorState}
 */
function replaceInlineStyle(editorState, context, type, attrs) {
    var markType  = editorState.getMarkType(type);
    var selection = editorState.getSelection();

    var $from = selection.$from;

    // Get from/to of current textNode
    var delimiter = getMarkDelimiter(editorState, type, $from.pos);
    if (!delimiter) {
        return editorState;
    }

    return editorState.applyTransform(function(pm) {
        pm.tr.addMark(delimiter.from, delimiter.to, markType.create(attrs)).applyAndScroll();
    });
}

/**
 * Remove an inline mark (only if existing) for a specific type
 *
 * @param {EditorState} editorState
 * @param {SelectionContext} context
 * @param {String} type
 * @return {EditorState}
 */
function removeInlineStyle(editorState, context, type) {
    var markType  = editorState.getMarkType(type);
    var selection = editorState.getSelection();

    var $from = selection.$from;

    // Get from/to of current textNode
    var delimiter = getMarkDelimiter(editorState, type, $from.pos);
    if (!delimiter) {
        return editorState;
    }

    return editorState.applyTransform(function(pm) {
        pm.tr.removeMark(delimiter.from, delimiter.to, markType).applyAndScroll();
    });
}

/**
 * @param {EditorState} editorState
 * @param {Array<MarkRangeParam> marks List of params to pass on
 * marking ranges as object of the form { from, to, options }
 * http://prosemirror.net/ref.html#ProseMirror.markRange
 * @param {Function} receiveMarkedRanges callback called with the created ProseMirror.MarkRanges
 * @return {EditorState}
 */
function markRanges(editorState, marks, receiveMarkedRanges) {
    return editorState.applyTransform(function (pm) {
        var markedRanges = [];
        marks.forEach(function (mark) {
            markedRanges.push(pm.markRange(mark.from, mark.to, mark.options));
        });
        receiveMarkedRanges(markedRanges);
    });
}

/**
 * @param {EditorState} editorState
 * @param {Array<MarkRange>} markedRanges to remove
 * @return {EditorState}
 */
function removeMarkedRanges(editorState, markedRanges) {
    if (markedRanges.length === 0) {
        return editorState;
    }

    return editorState.applyTransform(function (pm) {
        markedRanges.forEach(function (markedRange) {
            pm.removeRange(markedRange);
        });
    });
}

module.exports = {
    toggleInlineStyle:    toggleInlineStyle,
    toggleBlockType:      toggleBlockType,
    toggleBlockOrInline:  toggleBlockOrInline,
    wrapBlock:            wrapBlock,
    wrapInList:           wrapInList,
    canWrap:              canWrap,
    canWrapInList:        canWrapInList,
    unwrapBlock:          unwrapBlock,
    canUnwrap:            canUnwrap,
    hasBlockType:         hasBlockType,
    hasInlineStyle:       hasInlineStyle,
    markRanges:           markRanges,
    removeMarkedRanges:   removeMarkedRanges,
    replaceInlineStyle:   replaceInlineStyle,
    removeInlineStyle:    removeInlineStyle
};
