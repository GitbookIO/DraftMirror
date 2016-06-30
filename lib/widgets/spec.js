var is = require('is');
var Immutable = require('immutable');

var WidgetSpec = Immutable.Record({
    // Inline or block widget
    // This can be a funciton
    inline: true,

    // React component to render
    component: null,

    // Map of attributes from the node
    attrs: Immutable.Map(),

    // Props to inclde to the component
    props: {}
});

/**
 * Test if a node should be rendered as inline or not
 * @param {Node} node
 * @return {Boolean}
 */
WidgetSpec.prototype.isInline = function(node) {
    var isInline = this.get('inline');

    return is.fn(isInline)? isInline(node) : isInline;
};

WidgetSpec.prototype.getComponent = function() {
    return this.get('component');
};

WidgetSpec.prototype.getAttrs = function() {
    return this.get('attrs');
};

WidgetSpec.create = function(spec) {
    spec = spec || {};

    return WidgetSpec({
        inline:    spec.inline === undefined? true : spec.inline,
        component: spec.component,
        attrs:     Immutable.Map(spec.attrs || {}),
        props:     spec.props
    });
};

module.exports = WidgetSpec;
