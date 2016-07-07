var React = require('react');
var Immutable = require('immutable');
var prosemirror = require('prosemirror');
var classNames = require('classnames');
var historyPlugin = require('prosemirror/dist/history').historyPlugin;
var inputRulesPlugin = require('prosemirror/dist/inputrules').inputRules;

var applyDecorators = require('./decorators/applyDecorators');
var applyDecoratorsToDoc = require('./decorators/applyDecoratorsToDoc');
var compareNodes = require('./decorators/compareNodes');

var TooltipUtils = require('./tooltips');
var SelectionUtils = require('./modifiers/selection');
var Keymap = require('./models/keymap');

var DraftMirrorEditor = React.createClass({
    getDefaultProps: function() {
        return {
            spellCheck:    true,
            textAlignment: 'left',
            decorators:    [],
            keymaps:       [Keymap.createBase()],
            inputRules:    [],
            getTooltip:    function() { },
            onChange:      function() { }
        };
    },

    getInitialState: function () {
        return {
            tooltip: undefined
        };
    },

    /**
     * ProseMirror editor changed, update the editorState
     * And trigger a change if any
     */
    onChanged: function() {
        var that           = this;
        var editorState    = this.props.editorState;
        var newEditorState = editorState;

        newEditorState = newEditorState
            .merge({
                doc:        this.editor.doc,
                selection:  this.editor.selection,
                activeMarks: this.editor.activeMarks(),
                transforms: Immutable.List()
            })
            .setHistory(this.editor.history);

        // Use applyDecorators on block that changed
        compareNodes(editorState.getDoc(), newEditorState.getDoc(), function(node, offset) {
            applyDecorators(that.props.decorators, that.editor, node, offset);
        });

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
     * Update keymaps
     * todo: update on componentWillReceiveProps
     */
    updateKeymaps: function(newProps) {
        Immutable.List(newProps.keymaps)
            .forEach(function(keymap) {
                keymap.bindToEditor(this.editor);
            }, this);
    },

    /**
     * Updateinput rules
     */
    updateInputRules: function(newProps) {
        if (Immutable.is(newProps.inputRules, this.props.inputRules)) {
            return;
        }

        var inputRules = inputRulesPlugin.ensure(this.editor);

        Immutable.List(this.props.inputRules)
            .forEach(function(rule) {
                inputRules.removeRule(rule);
            });

        Immutable.List(newProps.inputRules)
            .forEach(function(rule) {
                inputRules.addRule(rule);
            });
    },

    /**
     * Create the editor
     */
    createEditor: function(newProps) {
        var div         = this.refs.editor;
        var editorState = newProps.editorState;

        if (this.editor) {
            this.bindListeners(this.editor, 'remove');
            div.innerHTML = '';
        }

        this.editor = new prosemirror.ProseMirror({
            place: div,
            doc: editorState.getDoc(),
            plugins: [
                historyPlugin
            ]
        });

        this.bindListeners(this.editor, 'add');

        applyDecoratorsToDoc(this.props.decorators, this.editor);

        this.updateKeymaps(newProps);
        this.updateInputRules(newProps);
    },

    /**
     * @param {ProseMirror.Editor} editor
     * @param {String} action 'add' | 'remove'
     */
    bindListeners: function (editor, action) {
        this.editor.on.filterTransform[action](this.onFilterTransform);
        this.editor.on.flush[action](this.onChanged);
    },

    /**
     * Mount the prosemirror editor
     */
    componentDidMount: function() {
        this.createEditor(this.props);

        this.onChanged();
    },

    /**
     * Receive new editorState, update ProseMirror accordingly
     */
    componentWillReceiveProps: function(newProps) {
        var newEditorState = newProps.editorState;

        this.updateInputRules(newProps);

        // New instance of editorState, recreate the editor
        if (newEditorState.getID() !== this.props.editorState.getID()) {
            this.createEditor(newProps);
        }

        // Update the document
        var newDoc = newEditorState.getDoc();
        if (this.editor.doc != newDoc) {
            this.editor.setDoc(newDoc);
        }

        // Update the selection
        var newSelection = newEditorState.getSelection();
        if (this.editor.selection != newSelection) {
            if (newSelection) this.editor.setSelection(newSelection);
            else {
                // TODO: reset selection
            }
        }

        // Apply the transform
        var transforms = newEditorState.getTransforms();
        transforms.forEach(function(fn) {
            fn(this.editor);
        }, this);

        // Get the tooltip here, to be able to call
        // editor.flush if needed (not possible once in render).
        var tooltip = this.getTooltip(newEditorState);
        if (tooltip) {
            // Positionning tooltip requires an updated DOM
            this.editor.flush();
        }
        this.setState({
            tooltip: tooltip
        });
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
     * Request the tooltips to be displayed
     * @param {DraftMirror.EditorState} editorState
     * @return {DraftMirror.Tooltip}
     */
    getTooltip: function (editorState) {
        var selection = editorState.getSelection();

        if (!selection || !this.editor || !this.editor.hasFocus()) {
            return undefined;
        }

        var context = SelectionUtils.contextAtSelection(editorState, selection);
        var tooltip = this.props.getTooltip(context);
        return tooltip;
    },

    /**
     * Create tooltip component or return undefined
     *
     * @return {React.Element}
     */
    renderTooltip: function() {
        // Rendering tooltips still has quite a few issues, so guard against errors
        // This avoid corrupting the Editor update loop if it fails
        try {
            var tooltip = this.state.tooltip;
            if (!tooltip) {
                return undefined;
            }

            var inner = React.createElement(tooltip.component, tooltip.props);
            var className = classNames('DraftMirrorEditor-Tooltip', tooltip.className);
            var selection = this.props.editorState.getSelection();

            return React.createElement('div', {
                className: className,
                style:     tooltipStyle(this.editor, selection, tooltip)
            }, inner);

        } catch (e) {
            // Unable to render tooltip
            // Eventually throw the error
            setTimeout(function () { throw e; });
            return undefined;
        }
    },

    render: function() {
        var editor = React.createElement('div', {
            className: 'DraftMirrorEditor-Container',
            ref: 'editor' // Where the ProseMirror editor is rendered
        });

        var tooltip = this.renderTooltip();

        return React.createElement('div', {
            className: 'DraftMirrorEditor',
            id: 'editor-' + this.props.editorState.getID()
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
        style.left = (coords.left + coords.right)/2;
        style.top = coords.bottom;
        break;
    default:
        break;
    }

    return style;
}
module.exports = DraftMirrorEditor;
