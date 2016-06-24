/**
 * @param {Editor} editor
 * @param {Selection} selection
 * @return {{left, right, top, bottom}} Bounding box of the node at
 * selection. If the node at selection is a parent, the right coordinate is wrong, and equals left
 * coordinate.
 */
function nodeAtSelectionBoundingBox(editor, selection) {
    if (!selection) {
        return _toBox(editor.coordsAtPos(0));
    }

    var maybeNode = selection.node;
    if (maybeNode) {
        if (maybeNode.isBlock) {
            var $from = selection.$from;
            // coords left side of the block
            var coords = editor.coordsAtPos($from.pos);
            coords = _coordsToMiddle(editor, coords);
            var editorRect = editor.content.getBoundingClientRect();
            return {
                top: coords.top,
                bottom: coords.bottom,
                right: editorRect.right,
                left: editorRect.left
            };
        } else {
            var before, after;
            // Take the middle of position after and before
            before = editor.coordsAtPos(selection.$from.pos);
            after = editor.coordsAtPos(selection.$to.pos);
            return {
                top: before.top,
                left: before.left,
                bottom: after.bottom,
                right: after.right
            };
        }
    } else {
        var parentNode = selection.$from.parent;
        // Try to select the whole parent node
        var start = selection.$from.pos - selection.$from.parentOffset;
        var end = start + parentNode.nodeSize;

        var parentSelection = {
            $from: { pos: start },
            $to: { pos: end }
        };
        return selectionBoundingBox(editor, parentSelection);
    }
}

/**
 * @param {Editor} editor
 * @param {Selection} selection
 * @param {String} markType
 * @return {{left, right, top, bottom}} Bounding box of the mark at selection
 */
function markAtSelectionBoundingBox(editor, selection, markType) {
    // TODO
    return selectionBoundingBox(editor, selection);
}

/**
 * @param {Editor} editor
 * @param {Selection} selection
 * @return {{left, right, top, bottom}} Bounding box of the
 * selection.
 */
function selectionBoundingBox(editor, selection) {
    var before = editor.coordsAtPos(selection.$from.pos);
    var after = editor.coordsAtPos(selection.$to.pos);

    var result = {
        left: before.left,
        right: after.right,
        top: before.top,
        bottom: after.bottom
    };

    var multiline = before.top !== after.top;
    if (multiline) {
        var editorRect = editor.content.getBoundingClientRect();
        result.right = editorRect.right;
        result.left = editorRect.left;
    }

    return result;
}

/**
 * @param {Editor} editor
 * @param {{left, right, top, bottom}} coords relative to editor
 * @return {{left, right, top, bottom}} absolute coordinates
 */
function absoluteCoords(editor, coords) {
    var editorCoords = editor.coordsAtPos(0);

    return {
        left:   coords.left - editorCoords.left,
        right:  coords.right - editorCoords.left,
        top:    coords.top - editorCoords.top,
        bottom: coords.bottom - editorCoords.top
    };
}

function _toBox(coords) {
    return {
        left:   coords.left,
        top:    coords.top,
        bottom: coords.bottom,
        right:  coords.right
    };
}

// Returns new coordinates, centered horizontally in the editor
function _coordsToMiddle(editor, coords) {
    var editorRect = editor.content.getBoundingClientRect();
    var haflWidth = (editorRect.right - editorRect.left)/2;
    return {
        left:   coords.left + haflWidth,
        right:  coords.right + haflWidth,
        top:    coords.top,
        bottom: coords.bottom
    };
}

function _barycenter(coords1, coords2) {
    return {
        left: (coords1.left + coords2.left)/2,
        right: (coords1.right + coords2.right)/2,
        top: (coords1.top + coords2.top)/2,
        bottom: (coords1.bottom + coords2.bottom)/2
    };
}

module.exports = {
    absoluteCoords: absoluteCoords,
    selectionBoundingBox: selectionBoundingBox,
    nodeAtSelectionBoundingBox: nodeAtSelectionBoundingBox,
    markAtSelectionBoundingBox: markAtSelectionBoundingBox
};
