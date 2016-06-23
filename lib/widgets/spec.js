var Immutable = require('immutable');

var WidgetSpec = Immutable.Record({
    // Inline or block widget
    inline: true,

    // React component to render
    component: null,

    // Map of attributes from the node
    attrs: Immutable.Map(),

    // Props to inclde to the component
    props: {}
});

WidgetSpec.prototype.isInline = function() {
    return this.get('inline');
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
