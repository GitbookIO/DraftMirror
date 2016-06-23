var applyDecorators = require('./applyDecorators');

/**
 * Apply decorators to a whole document
 * @param {Array<Decorator>} decorators
 * @param {ProseMirror} editor
 */
function applyDecoratorsToDoc(decorators, editor) {
    editor.doc.forEach(function(node, offset, index) {
        if (!node.isBlock) {
            return;
        }

        applyDecorators(decorators, editor, node, offset);
    });
}

module.exports = applyDecoratorsToDoc;
