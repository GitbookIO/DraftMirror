var decoratorId = 0;

/**
 * Create a decorator for an editor
 *
 * @param {Function(block)} fn
 * @return {Decorator}
 */
function createDecorator(fn) {
    return {
        id: ++decoratorId,
        fn: fn
    };
}

module.exports = createDecorator;
