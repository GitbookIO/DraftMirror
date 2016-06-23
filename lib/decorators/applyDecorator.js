
/**
 * Apply a decorator to annotate text in an editor
 *
 * @param {Decorator} decorator
 * @param {ProseMirror} editor
 * @param {Node} blockNode
 * @param {Number} blockOffset
 */
function applyDecorator(decorator, editor, blockNode, blockOffset) {
    var ranges         = [];
    var blockEndOffset = blockOffset + blockNode.nodeSize;

    // Remove all range in this block
    // hack using private apis!
    editor.ranges.ranges.forEach(function(range) {
        if (range.options.decorator !== decorator.id) {
            return;
        }

        if ((range.from >= blockOffset && range.from <= blockEndOffset)
            || (range.to >= blockOffset && range.to <= blockEndOffset)) {
            editor.removeRange(range);
        }
    });
    editor.ranges.sorted.resort();

    blockNode.forEach(function(node, offset, index) {
        if (!node.isText) {
            return;
        }

        decorator.fn({
            type:  blockNode.type.name,
            attrs: blockNode.attrs,
            text:  node.textContent
        }, function(start, end, className) {
            var _from = blockOffset + offset + start + 1;
            var _to   = blockOffset + offset + end + 1;

            editor.markRange(_from, _to, {
                decorator:      decorator.id,
                className:      className,
                inclusiveRight: true,
                inclusiveLeft:  true
            });
        });
    });
}

module.exports = applyDecorator;
