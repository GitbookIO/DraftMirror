/**
 * @param {Editor} editor
 * @param {Selection} selection
 * @return {{left, right, top, bottom}} Bounding box of the parent
 * node of selection (right is wrong though)
 */
function parentNodeBoundingBox(editor, selection) {
    var $from = selection.$from;
    var realPos = editor.coordsAtPos($from.pos - $from.parentOffset);

    return {
        left:   realPos.left,
        top:    realPos.top,
        bottom: realPos.bottom,
        right:  realPos.right
    };
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

module.exports = {
    relativeCoords: relativeCoords,
    parentNodeBoundingBox: parentNodeBoundingBox
};
