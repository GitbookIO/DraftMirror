var inputrules = require('prosemirror/dist/inputrules');
var InputRule = inputrules.InputRule;

/**
 * Create an input rule to insert a blockquote
 * @param  {EditorState} editorState
 * @param  {String} type
 * @return {InputRule}
 */
function blockQuoteRule(editorState, type) {
    var nodeType = editorState.getNodeType(type);
    return inputrules.blockQuoteRule(nodeType);
}

/**
 * Create an input rule to insert an ordered list
 * @param  {EditorState} editorState
 * @param  {String} type
 * @return {InputRule}
 */
function orderedListRule(editorState, type) {
    var nodeType = editorState.getNodeType(type);
    return inputrules.orderedListRule(nodeType);
}

/**
 * Create an input rule to insert an ordered list
 * @param  {EditorState} editorState
 * @param  {String} type
 * @return {InputRule}
 */
function bulletListRule(editorState, type) {
    var nodeType = editorState.getNodeType(type);
    return inputrules.bulletListRule(nodeType);
}

/**
 * Create an input rule to insert a code block
 * @param  {EditorState} editorState
 * @param  {String} type
 * @return {InputRule}
 */
function codeBlockRule(editorState, type) {
    var nodeType = editorState.getNodeType(type);
    return inputrules.codeBlockRule(nodeType);
}

/**
 * Create an input rule to insert an heading
 * @param  {EditorState} editorState
 * @param  {String} type
 * @param  {Number} level
 * @return {InputRule}
 */
function headingRule(editorState, type, level) {
    var nodeType = editorState.getNodeType(type);
    return inputrules.textblockTypeInputRule(
        new RegExp('^(#{' + level + '}) $'), ' ',
        nodeType);
}

/**
 * Create an input rule to insert an heading
 * @param  {EditorState} editorState
 * @param  {String} type
 * @return {InputRule}
 */
function hrRule(editorState, type) {
    var nodeType = editorState.getNodeType(type);
    var regexp = /^\s*([-*_]{3}) $/;
    var filter = ' ';

    return new InputRule(regexp, filter, function(pm, match, pos) {
        var $pos = pm.doc.resolve(pos);
        var start = pos - match[0].length;
        var attrs = {};

        if (!$pos.node(-1).canReplaceWith($pos.index(-1), $pos.indexAfter(-1), nodeType, attrs)) {
            return;
        }

        return pm.tr
            .setNodeType(start, nodeType, attrs)
            .apply();
    });
}

module.exports                 = InputRule;
module.exports.blockQuoteRule  = blockQuoteRule;
module.exports.orderedListRule = orderedListRule;
module.exports.bulletListRule  = bulletListRule;
module.exports.codeBlockRule   = codeBlockRule;
module.exports.headingRule     = headingRule;
module.exports.hrRule          = hrRule;
