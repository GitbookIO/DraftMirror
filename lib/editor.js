var React = require('react');
var Immutable = require('immutable');
var prosemirror = require('prosemirror');

var ProseMirrorEditor = React.createClass({
    /**
     * ProseMirror editor changed, update the editorState
     * And trigger a change if any
     */
    onChanged: function() {
        var editorState = this.props.editorState;
        var newEditorState = editorState;

        newEditorState = newEditorState.merge({
            doc:       this.editor.doc,
            selection: this.editor.selection,
            transform: null
        });

        if (!Immutable.is(editorState, newEditorState)) {
            this.props.onChange(newEditorState);
        }
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
    },

    /**
     * Receive new editorState, update ProseMirror accordingly
     */
    componentWillReceiveProps: function(newProps) {
        var newEditorState = newProps.editorState;
        var editorState    = this.props.editorState;

        var newDoc = newEditorState.getDoc();
        if (this.editor.doc != newDoc) {
            this.editor.setDoc(newDoc);
        }

        var newSelection = newEditorState.getSelection();
        if (this.editor.selection != newSelection) {
            this.editor.setSelection(newSelection);
        }

        var transform = newEditorState.getTransform();
        if (transform) {
            console.log('apply transform');
            transform(this.editor);
        }
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
        return <div className="ProseMirrorEditor" ref="editor"></div>;
    }
});

module.exports = ProseMirrorEditor;
