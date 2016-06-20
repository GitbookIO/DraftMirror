var React = require('react');
var ReactDOM = require('react-dom');
var classNames = require('classnames');
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

    /**
     * Render a block toggler for the toolbar
     */
    renderBlockButton: function(text, type, attrs) {
        var editorState = this.state.editorState;

        return <button
            className={classNames({
                'ToggleButton': true,
                'BlockButton': true,
                active: ProseMirror.StyleUtils.hasBlockType(editorState, type, attrs)
            })}
            onClick={this.onToggleBlock.bind(this, type, attrs)}
        >{text}</button>
    },

    /**
     * Render a style toggler for the toolbar
     */
    renderStyleButton: function(text, type, attrs) {
        var editorState = this.state.editorState;

        return <button
            className={classNames({
                'ToggleButton': true,
                'StyleButton': true,
                active: ProseMirror.StyleUtils.hasInlineStyle(editorState, type, attrs)
            })}
            onClick={this.onToggleStyle.bind(this, type, attrs)}
        >{text}</button>
    },

    render: function() {
        return <div className="EditorExample">
            <div className="Toolbar">
                {this.renderBlockButton('P', 'paragraph')}
                {this.renderBlockButton('H1', 'heading', { level: 1 })}
                {this.renderBlockButton('H2', 'heading', { level: 2 })}
                {this.renderBlockButton('H3', 'heading', { level: 3 })}


                {this.renderStyleButton('Bold', 'strong')}
                {this.renderStyleButton('Italic', 'em')}
                {this.renderStyleButton('Code', 'code')}
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

