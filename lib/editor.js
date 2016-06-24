var React = require('react');
var Immutable = require('immutable');
var prosemirror = require('prosemirror');

var applyDecorators = require('./decorators/applyDecorators');
var applyDecoratorsToDoc = require('./decorators/applyDecoratorsToDoc');

var TooltipUtils = require('./tooltips');
var SelectionUtils = require('./modifiers/selection');

var DraftMirrorEditor = React.createClass({
    getDefaultProps: function() {
        return {
            spellCheck: true,
            textAlignment: 'left',
            decorators:    [],
            getTooltip: function() { }
        };
    },

    /**
     * ProseMirror editor changed, update the editorState
     * And trigger a change if any
     */
    onChanged: function() {
        var editorState    = this.props.editorState;
        var newEditorState = editorState;

        newEditorState = newEditorState.merge({
            doc:        this.editor.doc,
            selection:  this.editor.selection,
            history:    this.editor.history,
            transforms: Immutable.List()
        });

        // TODO: Optimization
        // Use applyDecorators on block that changed
        applyDecoratorsToDoc(this.props.decorators, this.editor);

        if (!Immutable.is(editorState, newEditorState)) {
            this.props.onChange(newEditorState);
        }
    },

    /**
     * Filter transformation when readonly
     */
    onFilterTransform: function() {
        return Boolean(this.props.readOnly);
    },

    /**
     * Filter transformation when readonly
     */
    onClickOn: function(pos, node) {
        if (!this.props.onClickOn) {
            return;
        }

        return this.props.onClickOn({
            type: node.type.name
        });
    },

    /**
     * Mount the prosemirror editor
     */
    componentDidMount: function() {
        var div = this.refs.editor;
        var editorState = this.props.editorState;

        this.editor = new prosemirror.ProseMirror({
            place: div,
            doc: editorState.getDoc()
        });

        this.editor.on.change.add(this.onChanged);
        this.editor.on.selectionChange.add(this.onChanged);
        this.editor.on.filterTransform.add(this.onFilterTransform);
        this.editor.on.clickOn.add(this.onClickOn);

        applyDecoratorsToDoc(this.props.decorators, this.editor);
    },

    /**
     * Receive new editorState, update ProseMirror accordingly
     */
    componentWillReceiveProps: function(newProps) {
        var newEditorState = newProps.editorState;

        var newDoc = newEditorState.getDoc();
        if (this.editor.doc != newDoc) {
            this.editor.setDoc(newDoc);
        }

        var newSelection = newEditorState.getSelection();
        if (this.editor.selection != newSelection) {
            this.editor.setSelection(newSelection);
        }

        var transforms = newEditorState.getTransforms();
        transforms.forEach(function(fn) {
            fn(this.editor);
        }, this);
    },

    /**
     * Focus this editor
     */
    focus: function() {
        if (this.editor) {
            this.editor.focus();
        }
    },

    /**
     * Create tooltip component or return undefined
     *
     * @return {React.Element}
     */
    renderTooltip: function() {
        var editorState = this.props.editorState;
        var selection = editorState.getSelection();

        if (!selection || !this.editor || !this.editor.hasFocus()) {
            return undefined;
        }

        var node = SelectionUtils.nodeAtSelection(selection);

        var tooltip = this.props.getTooltip({
            type: node.type.name,
            attrs: node.attrs
        });

        if (!tooltip) {
            return undefined;
        }

        var inner = React.createElement(tooltip.component, tooltip.props);

        var absoluteBox = TooltipUtils.nodeAtSelectionBoundingBox(this.editor, selection);
        var coords = TooltipUtils.relativeCoords(this.editor, absoluteBox);

        var style = {
            top: coords.top
        };
        switch (tooltip.position) {
        case 'right':
            style.right = 0;
            break;
        case 'left':
            style.left = 0;
            break;
        case 'center':
            style.left = coords.left;
            break;
        default:
            break;
        }

        return React.createElement('div', {
            className: 'DraftMirrorEditor-Tooltip',
            style: style
        }, inner);
    },

    render: function() {
        var editor = React.createElement('div', {
            className: 'DraftMirrorEditor-Container',
            ref: 'editor' // Where the ProseMirror editor is rendered
        });

        var tooltip = this.renderTooltip();

        return React.createElement('div', {
            className: 'DraftMirrorEditor'
        }, editor, tooltip);
    }
});

module.exports = DraftMirrorEditor;
