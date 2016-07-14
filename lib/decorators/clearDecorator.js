
/**
 * Clear all markers from a decorator
 *
 * @param {Decorator} decorator
 * @param {ProseMirror} editor
 * @param {Node} blockNode
 * @param {Number} blockOffset
 */
function clearDecorator(decorator, editor, blockNode, blockOffset) {
    var blockEndOffset = blockOffset + blockNode.nodeSize;

    // Remove all range in this block
    // hack using private apis!
    var toRemove = [];
    editor.ranges.ranges.forEach(function(range) {
        if (range.options.decorator !== decorator.id) {
            return;
        }

        if ((range.from >= blockOffset && range.from <= blockEndOffset)
            || (range.to >= blockOffset && range.to <= blockEndOffset)) {
            toRemove.push(range);
        }
    });

    for (var i = 0; i < toRemove.length; i++) {
        editor.removeRange(toRemove[i]);
    }

    if (toRemove.length > 0) {
        editor.ranges.sorted.resort();
    }
}

module.exports = clearDecorator;
