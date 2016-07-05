var is = require('is');
var commands     = require('prosemirror/dist/commands');
var detectIndent = require('detect-indent');

var Keymap = require('../models/keymap');

/**
 * Insert a text in the editor only if current node is a code block
 * @param  {ProseMirror} pm
 * @param  {String|Function} text
 * @param  {Boolean} apply
 * @return {Boolean}
 */
function insertInCode(pm, text, apply) {
    var selection = pm.selection;
    var $from     = selection.$from;
    var $to       = selection.$to;
    var node      = selection.node;

    if (node) {
        return false;
    }
    if (!$from.parent.type.isCode || $to.pos > $from.end()) {
        return false;
    }

    if (apply !== false) {
        if (is.fn(text)) {
            text = text($from.parent);
        }

        pm.tr.typeText(text).applyAndScroll();
    }

    return true;
}

/**
 * Command to force enetr a newline
 */
function insertNewLine(editor, apply) {
    return insertInCode(editor, '\n', apply);
}

/**
 * Command to insert a tab
 */
function insertTab(editor, apply) {
    return insertInCode(editor, function(node) {
        var nodeText = node.textContent;
        return detectIndent(nodeText).indent || '    ';
    }, apply);
}

/**
 * Create keymap to make editing code easy
 * @return {Keymap}
 */
function createKeymap(priority) {
    return Keymap.create({
        'Enter':       commands.newlineInCode,
        'Shift-Enter': insertNewLine,
        'Tab':         insertTab
    }, priority);
}

module.exports = {
    createKeymap:  createKeymap
};
