var clearDecorator = require('./clearDecorator');

/**
 * Clear all markers from a decorator
 *
 * @param {Decorator} decorator
 * @param {ProseMirror} editor
 */
function clearDecoratorInDoc(decorator, editor) {
    editor.doc.forEach(function(node, offset, index) {
        if (!node.isBlock) {
            return;
        }

        clearDecorator(decorator, editor, node, offset);
    });
}

module.exports = clearDecoratorInDoc;
