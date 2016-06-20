var React = require('react');
var ReactDOM = require('react-dom');
var schema = require("prosemirror/dist/schema-basic").schema

var ProseMirror = require('../');
var defaultJson = require('./default');

console.log('schema', schema);

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
        this.onChange(
            ProseMirror.StyleUtils.toggleInlineStyle(this.state.editorState, style)
        );
    },

    onToggleBlock: function(type, attrs) {
        this.onChange(
            ProseMirror.StyleUtils.toggleBlockType(this.state.editorState, type, attrs)
        );
    },

    onLog: function() {
        var editorState = this.state.editorState;
        console.log(editorState.getContentAsJSON())
    },

    render: function() {
        return <div className="EditorExample">
            <div className="Toolbar">
                <button onClick={this.onToggleBlock.bind(this, 'paragraph', {})}>P</button>
                <button onClick={this.onToggleBlock.bind(this, 'heading', { level: 1 })}>H1</button>
                <button onClick={this.onToggleBlock.bind(this, 'heading', { level: 2 })}>H2</button>
                <button onClick={this.onToggleBlock.bind(this, 'heading', { level: 3 })}>H3</button>


                <button onClick={this.onToggleStyle.bind(this, 'strong')}>Bold</button>
                <button onClick={this.onToggleStyle.bind(this, 'em')}>Italic</button>
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

