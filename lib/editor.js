var React = require('react');
var Immutable = require('immutable');
var prosemirror = require('prosemirror');

var applyDecorator = require('./decorators/applyDecorator');
var applyDecoratorsToDoc = require('./decorators/applyDecoratorsToDoc');

var ProseMirrorEditor = React.createClass({
    getDefaultProps: function() {
        return {
            textAlignment: 'left',
            readOnly:      false,
            decorators:    []
        };
    },

    /**
     * ProseMirror editor changed, update the editorState
     * And trigger a change if any
     */
    onChanged: function() {
        var editorState    = this.props.editorState;
        var decorators     = this.props.decorators;
        var newEditorState = editorState;

        newEditorState = newEditorState.merge({
            doc:        this.editor.doc,
            selection:  this.editor.selection,
            history:    this.editor.history,
            transforms: Immutable.List()
        });

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

    render: function() {
        return React.createElement('div', {
            className: 'ProseMirrorEditor',
            ref: 'editor' });
    }
});

module.exports = ProseMirrorEditor;
