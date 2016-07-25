var Fragment = require('prosemirror/dist/model/fragment').Fragment;
var Node = require('prosemirror/dist/model/node').Node;
var Slice = require('prosemirror/dist/model/replace').Slice;

/**
 * Modify a fragment of p/br to normalize it for a raw editor
 * @param {Slice} input
 * @param {NodeType} pType
 * @return {Slice}
 */
function normalize(input, pType) {
    var output = Fragment.empty;

    input.content.forEach(function(p) {
        output = output
            .addToEnd(p)
            .addToEnd(new Node(pType));
    });

    return new Slice(output, input.openLeft, input.openRight, input.possibleParent);
}

module.exports = {
    normalize: normalize
};
