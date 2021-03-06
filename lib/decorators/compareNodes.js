
/**
 * Compare children of two nodes to signal those who changed
 *
 * @param {Node} a
 * @param {Node} b
 * @param {Function(node, offset)} fn
 */
function compareNodes(a, b, fn) {
    if (a == b) {
        return;
    }

    var maxA = a.content.size;
    var maxB = b.content.size;

    function compare(baseA, baseB, aFragment, bFragment) {
        var changed = aFragment.findDiffStart(bFragment);
        if (!changed) {
            return;
        }

        var changedA = baseA + changed;
        var changedB = baseB + changed;

        // Resolve position in new content
        if (changedB >= maxB) {
            return;
        }

        var posB = b.resolve(changedB);
        var posBParent = changedB - posB.parentOffset;
        var endBParent = posBParent + posB.parent.nodeSize;

        var posToSignal = (posB.atNodeBoundary && changedB === (maxB - 2)) ? b.resolve(changedB + 1) : posB;
        var posToSignalOffset = posToSignal.pos;

        var posToSignalParent = posToSignalOffset - posToSignal.parentOffset;
        var offsetToSignal = posToSignalParent - 1;

        // Signal change
        if (offsetToSignal >= 0) fn(posToSignal.parent, offsetToSignal);
        else console.warn('invalid offset during compare of prosemirror nodes');

        // Resolve position in old content to keep moving
        if (changedA >= maxA) {
            return;
        }

        var posA = a.resolve(changedA);
        var posAParent = changedA - posA.parentOffset;
        var endAParent = posAParent + posA.parent.nodeSize;

        // End are outside scope?
        if (endAParent >= maxA || endBParent >= maxB) {
            return;
        }

        var afterA = a.slice(endAParent);
        var afterB = b.slice(endBParent);

        compare(endAParent, endBParent, afterA.content, afterB.content);
    }

    compare(0, 0, a.content, b.content);
}

module.exports = compareNodes;
