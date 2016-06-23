var applyDecorator = require('./applyDecorator');

/**
 * Apply decorators to a node
 *
 * @param {Array<Decorator>} decorators
 * @param {ProseMirror} editor
 * @param {Node} blockNode
 * @param {Number} blockOffset
 */
function applyDecorators(decorators, editor, blockNode, blockOffset) {
   decorators.forEach(function(decorator) {
        applyDecorator(decorator, editor, blockNode, blockOffset);
   });
}

module.exports = applyDecorators;
