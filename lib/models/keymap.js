var Immutable = require('immutable');
var baseKeymap = require('prosemirror/dist/commands').baseKeymap;

var Keymap = Immutable.Record({
    map:      {},
    priority: 0
});

/**
 * Create a keymap
 * @param  {Object} map
 * @param  {Number} priority
 * @return {Keymap}
 */
Keymap.create = function(map, priority) {
    return new Keymap({
        map:      map,
        priority: priority
    });
};

/**
 * Create the base keymap
 * @return {Keymap}
 */
Keymap.createBase = function(map) {
    return Keymap.create(baseKeymap, 0);
};

module.exports = Keymap;
