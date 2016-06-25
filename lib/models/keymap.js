var Immutable = require('immutable');
var baseKeymap = require('prosemirror/dist/commands').baseKeymap;
var PMKeymap = require('prosemirror').Keymap;

var Keymap = Immutable.Record({
    map:      {},
    priority: 0
}, 'Keymap');

Keymap.prototype.getPriority = function() {
    return this.get('priority');
};

Keymap.prototype.getMap = function() {
    return this.get('map');
};

/**
 * Bind a keymap to an editor
 * @param  {ProseMirror} editor
 */
Keymap.prototype.bindToEditor = function(editor) {
    editor.addKeymap(this.getMap(), this.getPriority());
};

/**
 * Create a keymap
 * @param  {Object} map
 * @param  {Number} priority
 * @return {Keymap}
 */
Keymap.create = function(map, priority) {
    return new Keymap({
        map:      map instanceof PMKeymap? map : new PMKeymap(map),
        priority: priority
    });
};

/**
 * Create the base keymap
 * @return {Keymap}
 */
Keymap.createBase = function() {
    return Keymap.create(baseKeymap, 0);
};

module.exports = Keymap;
module.exports.baseKeymap = Keymap.createBase();
