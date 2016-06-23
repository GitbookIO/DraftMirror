/**
 * @param {EditorState} editorState
 * @return {Node?} The closest node to selection
 */
function nodeAtSelection(selection) {
    if (!selection) {
        return null;
    }

    var maybeNode = selection.node;
    if (maybeNode) return maybeNode;

    return selection.$from.parent;
}

/**
 * @param {Editor} editor
 * @param {Selection} selection
 * @return {{left, right, top, bottom}} Bounding box of the
 * node at selection. Right is wrong though. And if the selection is
 * on a node, then this node must be selected in the editor too.
 */
function nodeAtSelectionBoundingBox(editor, selection) {
    if (!selection) {
        return _toBox(editor.coordsAtPos(0));
    }

    var $from, coords;
    var maybeNode = selection.node;
    if (maybeNode) {
        if (maybeNode.isBlock) {
            $from = selection.$from;
            // coords left side of the block
            coords = editor.coordsAtPos($from.pos);
            coords = _coordsToMiddle(editor, coords);
            return _toBox(coords);
        } else {
            var before, after;
            // Take the middle of position after and before
            before = editor.coordsAtPos(selection.$from.pos);
            after = editor.coordsAtPos(selection.$to.pos);
            return _toBox(_barycenter(before, after));
        }
    } else {
        // Relative to parent node
        $from = selection.$from;
        coords = editor.coordsAtPos($from.pos - $from.parentOffset);

        return _toBox(coords);
    }
}

/**
 * @param {Editor} editor
 * @param {{left, right, top, bottom}} Bounding box
 * @return {{left, right, top, bottom}} Bounding box relative to Editor
 */
function relativeCoords(editor, box) {
    var editorCoords = editor.coordsAtPos(0);

    return {
        left:   box.left - editorCoords.left,
        right:  box.right - editorCoords.left,
        top:    box.top - editorCoords.top,
        bottom: box.bottom - editorCoords.top
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
    nodeAtSelection: nodeAtSelection,
    relativeCoords: relativeCoords,
    nodeAtSelectionBoundingBox: nodeAtSelectionBoundingBox
};
