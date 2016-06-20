# DraftMirror

DraftMirror provides a [Draft.js](https://facebook.github.io/draft-js/)-like API on top of [ProseMirror](http://prosemirror.net).

### Installation

```
$ npm install draftmirror
```

### Basic Usage

```js
var DraftMirror = require('draftmirror');

var MyApp = React.createClass({
    getInitialState: function() {
        return {
            editorState: DraftMirror.EditorState.createFromJSON(schema, defaultJson)
        }
    },

    onChange: function(newEditorState) {
        this.setState({
            editorState: newEditorState
        });
    },

    render: function() {
        return <DraftMirror
            editorState={this.state.editorState}
            onChange={this.onChange}
        />;
    }
});
```

### API

##### Modify style and blocks

```js
var newEditorState = DraftMirror.StyleUtils.toggleInlineStyle(editorState, 'strong');
```
