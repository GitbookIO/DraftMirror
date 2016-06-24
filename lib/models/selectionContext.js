var Immutable = require('immutable');

var SelectionContext = Immutable.Record({
    // Current marks appleid to the selection
    marks:      Array([]),

    // Current node (selected or parent)
    node:       null,

    // Current selection
    selection:  null
}, 'SelectionContext');


module.exports = SelectionContext;