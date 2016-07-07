var React = require('react');
var ReactDOM = require('react-dom');
var classNames = require('classnames');

var Schema = require('prosemirror/dist/model').Schema;
var schema = require('prosemirror/dist/schema-basic').schema;

var DraftMirror = require('../');

var MathComponent = require('./math');
var defaultJson = require('./default');

var HASHTAG_REGEX = /\#[\w\u0590-\u05ff]+/g;

function findWithRegex(regex, contentBlock, className, callback) {
    var text = contentBlock.text;
    var matchArr, start;

    while ((matchArr = regex.exec(text)) !== null) {
        start = matchArr.index;
        callback(start, start + matchArr[0].length, className);
    }
}

var testDecorator = DraftMirror.createDecorator(function(contentBlock, callback) {
    console.log('find hashtag in ', JSON.stringify(contentBlock.text));
    findWithRegex(HASHTAG_REGEX, contentBlock, 'decorate-hashtag', callback);
});

var Tooltip = React.createClass({
    render: function() {
        var style = {};
        if (this.props.center) {
            style = {
                position: 'absolute',
                transform: 'translate(-50%, -50%)'
            };
        }
        return <div style={style}>
            <span>{this.props.text}</span>
        </div>;
    }
});

var MathWidget = DraftMirror.createWidget({
    component: MathComponent,
    attrs: {
        tex: {}
    }
});


var customSchema = new Schema({
    nodes: schema.nodeSpec.addBefore('image', 'math', {
        type: MathWidget, group: 'inline'
    }),
    marks: schema.markSpec
});

var EditorExample = React.createClass({
    getInitialState: function() {
        return {
            editorState: DraftMirror.EditorState.createFromJSON(customSchema, defaultJson)
        };
    },

    onChange: function(newEditorState) {
        this.setState({
            editorState: newEditorState
        });
    },


    onRecreate: function() {
        this.onChange(DraftMirror.EditorState.createFromJSON(customSchema, defaultJson));
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
        console.log(editorState.getContentAsJSON());
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
        >{text}</button>;
    },

    renderTestButton: function() {
        var that = this;
        function onClick() {
            var editorState = that.state.editorState;
            editorState = DraftMirror.EntityUtils.insertEntity(
                    editorState,
                    'image',
                    {
                        src: 'http://prosemirror.net/img/logo.png'
                    });

            editorState = DraftMirror.EntityUtils.appendEntityAndFocus(
                    editorState,
                    'heading',
                    { level: 1});

            that.onChange(editorState);
        }

        return <button
                   className={classNames({
                       'ToggleButton': true,
                       'BlockButton': true,
                       'active': false
                   })}
                   onClick={onClick}>
            Test
        </button>;
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
    getTooltip: function(context) {
        // Inspect marks
        var tooltip = context.marks.reduce(function (tooltip, mark) {
            if (mark.type.name === 'link') {
                return tooltip || {
                    component: Tooltip,
                    type: 'mark',
                    position: 'bottom',
                    props: {
                        text: mark.attrs.href
                    }
                };
            } else {
                return tooltip;
            }
        }, undefined);
        if (tooltip) return tooltip;

        var node = context.node;
        if (!node) return undefined;

        switch(node.type) {
        case 'heading':
            return {
                component: Tooltip,
                type: 'node',
                position: 'right', // left, bottom
                props: {
                    text: 'heading tooltip'
                }
            };
        case 'image':
            return {
                component: Tooltip,
                type: 'node',
                position: 'center',
                props: {
                    text: node.attrs.src,
                    center: true
                }
            };
        case 'horizontal_rule':
            return {
                component: Tooltip,
                type: 'node',
                position: 'center',
                props: {
                    text: 'HR tooltip',
                    center: true
                }
            };
        default:
        }
    },

    render: function() {
        var editorState = this.state.editorState;

        return <div className='EditorExample'>
            <div className='Toolbar'>
                <div className='ButtonsGroup'>
                    <button onClick={this.onUndo} disabled={!DraftMirror.HistoryUtils.canUndo(editorState)}>Undo</button>
                    <button onClick={this.onRedo} disabled={!DraftMirror.HistoryUtils.canRedo(editorState)}>Redo</button>
                    <button onClick={this.onRecreate}>Recreate</button>
                </div>

                <div className='ButtonsGroup'>
                    {this.renderBlockButton('P', 'paragraph')}
                    {this.renderBlockButton('H1', 'heading', { level: 1 })}
                    {this.renderBlockButton('H2', 'heading', { level: 2 })}
                    {this.renderBlockButton('H3', 'heading', { level: 3 })}
                    {this.renderBlockButton('Code', 'code')}
                </div>

                <div className='ButtonsGroup'>
                    {this.renderStyleButton('Bold', 'strong')}
                    {this.renderStyleButton('Italic', 'em')}
                    {this.renderStyleButton('Code', 'code')}
                </div>

                <div className='ButtonsGroup'>
                    <button onClick={this.onInsertHR}>Insert HR</button>
                    <button onClick={this.onInsertImage}>Insert Image</button>
                </div>

                <div className='ButtonsGroup'>
                    <button onClick={this.onLog}>Log</button>
                </div>
            </div>
            <div className='ButtonsGroup'>
                {this.renderTestButton()}
            </div>


            <DraftMirror
                keymaps={[
                    DraftMirror.Keymap.baseKeymap,
                    DraftMirror.CodeUtils.createKeymap(300)
                ]}
                inputRules={[
                    DraftMirror.InputRule.blockQuoteRule(editorState, 'blockquote'),
                    DraftMirror.InputRule.codeBlockRule(editorState, 'code_block'),
                    DraftMirror.InputRule.hrRule(editorState, 'horizontal_rule')
                ]}
                editorState={editorState}
                onChange={this.onChange}
                decorators={[testDecorator]}
                getTooltip={this.getTooltip}
            />
        </div>;
    }
});

ReactDOM.render(
    <EditorExample />,
    document.getElementById('target')
);
