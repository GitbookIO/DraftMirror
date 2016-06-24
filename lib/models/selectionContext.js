var Immutable = require('immutable');

var SelectionContext = Immutable.Record({
    // Current marks appleid to the selection
    marks:      Array([]),

    // Current node (selected or parent)
    node:       null,

    // Current selection
    selection:  null
}, 'SelectionContext');

SelectionContext.prototype.getMarks = function() {
    return this.get('marks');
};

SelectionContext.prototype.getNode = function() {
    return this.get('node');
};

SelectionContext.prototype.getSelection = function() {
    return this.get('selection');
};

module.exports = SelectionContext;