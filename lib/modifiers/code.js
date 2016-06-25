var commands     = require('prosemirror/dist/commands');
var Keymap = require('../models/keymap');

/**
 * Create keymap to make editing code easy
 * @return {Keymap}
 */
function createKeymap(priority) {
    return Keymap.create({
        'Enter':  commands.newlineInCode
    }, priority);
}

module.exports = {
    createKeymap: createKeymap
};
