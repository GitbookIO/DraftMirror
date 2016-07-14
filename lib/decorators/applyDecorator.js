var clearDecorator = require('./clearDecorator');

/**
 * Apply a decorator to annotate text in an editor
 *
 * @param {Decorator} decorator
 * @param {ProseMirror} editor
 * @param {Node} blockNode
 * @param {Number} blockOffset
 */
function applyDecorator(decorator, editor, blockNode, blockOffset) {
    clearDecorator(decorator, editor, blockNode, blockOffset);

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
