var React = require('react');

var MathComponent = React.createClass({
    onDoubleClick: function() {
        var tex = this.props.attrs.tex;
        var newTex = window.prompt('Tex:', tex);


    },

    render: function() {
        var tex = this.props.attrs.tex;
        return <div contentEditable={false} onDoubleClick={this.onDoubleClick}>{tex}</div>;
    }
});

module.exports = MathComponent;
