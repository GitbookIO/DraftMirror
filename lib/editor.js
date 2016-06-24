var React = require('react');
var Immutable = require('immutable');
var prosemirror = require('prosemirror');
var historyPlugin = require('prosemirror/dist/history').historyPlugin;

var applyDecorators = require('./decorators/applyDecorators');
var applyDecoratorsToDoc = require('./decorators/applyDecoratorsToDoc');

var TooltipUtils = require('./tooltips');
var SelectionUtils = require('./modifiers/selection');

var DraftMirrorEditor = React.createClass({
    getDefaultProps: function() {
        return {
            spellCheck:    true,
            textAlignment: 'left',
            decorators:    [],
            keymaps:       [],
            getTooltip:    function() { }
        };
    },

    /**
     * ProseMirror editor changed, update the editorState
     * And trigger a change if any
     */
    onChanged: function() {
        var editorState    = this.props.editorState;
        var newEditorState = editorState;

        newEditorState = newEditorState
            .merge({
                doc:        this.editor.doc,
                selection:  this.editor.selection,
                transforms: Immutable.List()
            })
            .setHistory(this.editor.history);

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
     * Update keymaps
     * todo: update on componentWillReceiveProps
     */
    updateKeymaps: function() {
        Immutable.List(this.props.keymaps)
            .forEach(function(keymap) {
                keymap.bindToEditor(this.editor);
            }, this);
    },

    /**
     * Mount the prosemirror editor
     */
    componentDidMount: function() {
        var div = this.refs.editor;
        var editorState = this.props.editorState;

        this.editor = new prosemirror.ProseMirror({
            place: div,
            doc: editorState.getDoc(),
            plugins: [historyPlugin]
        });

        this.editor.on.change.add(this.onChanged);
        this.editor.on.selectionChange.add(this.onChanged);
        this.editor.on.filterTransform.add(this.onFilterTransform);
        this.editor.on.clickOn.add(this.onClickOn);

        this.updateKeymaps();
        this.onChanged();
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

        var context = SelectionUtils.contextAtSelection(editorState, selection);
        var tooltip = this.props.getTooltip(context);

        if (!tooltip) {
            return undefined;
        }

        var inner = React.createElement(tooltip.component, tooltip.props);


        return React.createElement('div', {
            className: 'DraftMirrorEditor-Tooltip',
            style: tooltipStyle(this.editor, selection, tooltip)
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

function tooltipStyle(editor, selection, tooltip) {
    var style = {};
    var coords;
    switch (tooltip.type || 'node') {
    case 'mark':
        coords = TooltipUtils.selectionBoundingBox(editor, selection);
        break;
    case 'node':
        coords = TooltipUtils.nodeAtSelectionBoundingBox(editor, selection);

        break;
    }
    // To screen coordinates
    coords = TooltipUtils.absoluteCoords(editor, coords);


    switch (tooltip.position || 'center') {
    case 'right':
        style.right = 0;
        style.top = coords.top;
        break;
    case 'left':
        style.left = 0;
        style.top = coords.top;
        break;
    case 'center':
        style.left = (coords.left + coords.right)/2;
        style.top = (coords.top + coords.bottom)/2;
        break;
    case 'bottom':
        style.left = coords.left;
        style.top = coords.bottom;
        break;
    default:
        break;
    }

    return style;
}
module.exports = DraftMirrorEditor;
