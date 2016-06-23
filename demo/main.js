var React = require('react');
var ReactDOM = require('react-dom');
var classNames = require('classnames');

var Schema = require("prosemirror/dist/model").Schema;
var schema = require("prosemirror/dist/schema-basic").schema;

var DraftMirror = require('../');

var MathComponent = require('./math');
var defaultJson = require('./default');

var Tooltip = React.createClass({
    render: function() {
        return <div>
            <span>Set anchor</span>
        </div>;
    }
});

var EditorExample = React.createClass({
    getInitialState: function() {
        var MathWidget = DraftMirror.createWidget({
            component: MathComponent,
            attrs: {
                tex: true
            },
            props: {

            }
        });


        var customSchema = new Schema({
            nodes: schema.nodeSpec.addBefore('image', 'math', {
                type: MathWidget, group: "inline"
            }),
            marks: schema.markSpec
        });


        return {
            editorState: DraftMirror.EditorState.createFromJSON(customSchema, defaultJson)
        }
    },

    onChange: function(newEditorState) {
        this.setState({
            editorState: newEditorState
        });
    },

    onToggleStyle: function(style) {
        this.onChange(
            DraftMirror.StyleUtils.toggleInlineStyle(this.state.editorState, style)
        );
    },

    onToggleBlock: function(type, attrs) {
        this.onChange(
            DraftMirror.StyleUtils.toggleBlockType(this.state.editorState, type, attrs)
        );
    },

    onLog: function() {
        var editorState = this.state.editorState;
        console.log(editorState.getContentAsJSON())
    },

    /**
     * Redo / Undo
     */
    onUndo: function() {
        var editorState = this.state.editorState;

        this.onChange(
            DraftMirror.HistoryUtils.undo(editorState)
        );
    },
    onRedo: function() {
        var editorState = this.state.editorState;

        this.onChange(
            DraftMirror.HistoryUtils.redo(editorState)
        );
    },

    /**
     * Prompt and insert an image
     */
    onInsertImage: function() {
        var editorState = this.state.editorState;
        var src = window.prompt('SRC:');

        this.onChange(
            DraftMirror.EntityUtils.insertEntity(editorState, 'image', {
                src: src
            })
        );
    },

    /**
     * Insert an HR
     */
    onInsertHR: function() {
        var editorState = this.state.editorState;

        this.onChange(
            DraftMirror.EntityUtils.insertHR(editorState, 'horizontal_rule')
        );
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
                active: DraftMirror.StyleUtils.hasBlockType(editorState, type, attrs)
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
                active: DraftMirror.StyleUtils.hasInlineStyle(editorState, type, attrs)
            })}
            onClick={this.onToggleStyle.bind(this, type, attrs)}
        >{text}</button>;
    },

    /**
     * Create tooltip
     */
    getTooltip: function(node) {
        switch(node.type) {
        case 'heading':
            return {
                component: Tooltip,
                position: 'right'
            };
        default:
            return undefined;
        }
    },

    render: function() {
        var editorState = this.state.editorState;

        return <div className="EditorExample">
            <div className="Toolbar">
                <div className="ButtonsGroup">
                    <button onClick={this.onUndo} disabled={!DraftMirror.HistoryUtils.canUndo(editorState)}>Undo</button>
                    <button onClick={this.onRedo} disabled={!DraftMirror.HistoryUtils.canRedo(editorState)}>Redo</button>
                </div>

                <div className="ButtonsGroup">
                    {this.renderBlockButton('P', 'paragraph')}
                    {this.renderBlockButton('H1', 'heading', { level: 1 })}
                    {this.renderBlockButton('H2', 'heading', { level: 2 })}
                    {this.renderBlockButton('H3', 'heading', { level: 3 })}
                    {this.renderBlockButton('Code', 'code')}
                </div>

                <div className="ButtonsGroup">
                    {this.renderStyleButton('Bold', 'strong')}
                    {this.renderStyleButton('Italic', 'em')}
                    {this.renderStyleButton('Code', 'code')}
                </div>

                <div className="ButtonsGroup">
                    <button onClick={this.onInsertHR}>Insert HR</button>
                    <button onClick={this.onInsertImage}>Insert Image</button>
                </div>

                <div className="ButtonsGroup">
                    <button onClick={this.onLog}>Log</button>
                </div>
            </div>

            <DraftMirror
                editorState={editorState}
                onChange={this.onChange}
                getTooltip={this.getTooltip}
            />
        </div>;
    }
});

ReactDOM.render(
    <EditorExample />,
    document.getElementById('target')
);

