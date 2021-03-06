var Immutable = require('immutable');
var baseKeymap = require('prosemirror/dist/commands').baseKeymap;
var PMKeymap = require('prosemirror').Keymap;

var Keymap = Immutable.Record({
    map:      {}, // PMKeymap
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
 * Unbind a keymap from an editor
 * @param  {ProseMirror} editor
 */
Keymap.prototype.unbindToEditor = function(editor) {
    editor.removeKeymap(this.getMap());
};

/**
 * Add a set of keys
 * @param {Object} keys
 * @return {Keymap}
 */
Keymap.prototype.addKeys = function(keys) {
    var map = this.getMap();

    var newMap = map.update(keys);

    return this.set('map', newMap);
};

/**
 * Add a binding
 * @param {String} key
 * @param {Funciton} fn
 * @return {Keymap}
 */
Keymap.prototype.addKey = function(key, fn) {
    return this.addKeys(Immutable.Map([
        [key, fn]
    ]).toJS());
};

/**
 * Remove a binding
 * @param {String} binding
 * @return {Keymap}
 */
Keymap.prototype.removeKey = function(key) {
    // TODO Use keymap.update instead, once it is fixed
    // https://github.com/marijnh/browserkeymap/issues/3
    key = PMKeymap.normalizeKeyName(key);
    var bindings = this.getMap().bindings;
    bindings[key] = undefined;
    var newMap = new PMKeymap(bindings);
    return this.set('map', newMap);
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
