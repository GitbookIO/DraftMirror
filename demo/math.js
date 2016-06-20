var React = require('react');
var DraftMirror = require('../');

var MathComponent = React.createClass({
    render: function() {
        var tex = this.props.attrs.tex;
        return <div contentEditable={false}>{tex}</div>;
    }
});

var MathWidget = DraftMirror.createWidget({
    component: MathComponent,
    attrs: {
        tex: true
    }
});
module.exports = MathWidget;
