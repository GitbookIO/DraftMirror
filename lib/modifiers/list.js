var listCommands = require('prosemirror/dist/commands-list');
var Keymap = require('../models/keymap');

/**
 * Create keymap to make editing list easy
 * @return {Keymap}
 */
function createKeymap(nodeType, priority) {
    return Keymap.create({
        'Enter': listCommands.splitListItem(nodeType),
        'Mod-[': listCommands.liftListItem(nodeType),
        'Mod-]': listCommands.sinkListItem(nodeType)
    }, priority);
}

module.exports = {
    createKeymap: createKeymap
};
