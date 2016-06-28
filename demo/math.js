var React = require('react');

var MathComponent = React.createClass({
    render: function() {
        console.log(this.props);
        var tex = this.props.attrs.tex;
        return <div contentEditable={false} onDoubleClick={this.onDoubleClick}>{tex}</div>;
    }
});

module.exports = MathComponent;
