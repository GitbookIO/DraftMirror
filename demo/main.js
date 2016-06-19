var React = require('react');
var ReactDOM = require('react-dom');
var schema = require("prosemirror/dist/schema-basic").schema

var ProseMirror = require('../');
var defaultJson = require('./default');

var EditorExample = React.createClass({
    getInitialState: function() {
        return {
            editorState: ProseMirror.EditorState.createFromJSON(schema, defaultJson)
        }
    },

    onChange: function(newEditorState) {
        this.setState({
            editorState: newEditorState
        });
    },

    onToggleStyle: function(style) {

    },

    onLog: function() {
        var editorState = this.state.editorState;
        console.log(editorState.getContentAsJSON())
    },

    render: function() {
        return <div className="EditorExample">
            <div className="Toolbar">
                <button onClick={this.onToggleStyle.bind(this, 'bold')}>Bold</button>
                <button onClick={this.onToggleStyle.bind(this, 'italic')}>Italic</button>
                <button onClick={this.onLog}>Log</button>
            </div>

            <ProseMirror
                editorState={this.state.editorState}
                onChange={this.onChange}
            />
        </div>;
    }
});

ReactDOM.render(
    <EditorExample />,
    document.getElementById('target')
);

