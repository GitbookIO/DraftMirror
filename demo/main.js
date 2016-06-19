var React = require('react');
var ReactDOM = require('react-dom');

var ProseMirror = require('../');

var EditorExample = React.createClass({
    getInitialState: function() {
        return {
            editorState: new ProseMirror.EditorState()
        }
    },

    onChange: function(newEditorState) {
        this.setState({
            editorState: newEditorState
        });
    },

    render: function() {
        return <ProseMirror
            editorState={this.state.editorState}
            onChange={this.onChange}
        />;
    }
});

ReactDOM.render(
    <EditorExample />,
    document.getElementById('target')
);

