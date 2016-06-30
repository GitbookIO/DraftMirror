

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

    function compare(baseA, baseB, aFragment, bFragment) {
        var changed = aFragment.findDiffStart(bFragment);
        if (!changed) {
            return;
        }

        var changedA = baseA + changed;
        var changedB = baseB + changed;

        var posA = a.resolve(changedA);
        var posB = b.resolve(changedB);

        var posAParent = changedA - posA.parentOffset;
        var posBParent = changedB - posB.parentOffset;

        var endAParent = posAParent + posA.parent.nodeSize;
        var endBParent = posBParent + posB.parent.nodeSize;

        fn(posB.parent, posBParent - 1);

        if (endAParent >= (a.nodeSize - 1) || endBParent >= (b.nodeSize - 1)) {
            return;
        }

        var afterA = a.slice(endAParent);
        var afterB = b.slice(endBParent);

        compare(endAParent, endBParent, afterA.content, afterB.content);
    }

    compare(0, 0, a.content, b.content);
}

module.exports = compareNodes;
