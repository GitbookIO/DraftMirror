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

##### Widgets

DraftMirror allows the extension of ProseMirror syntax using custom React widgets:

```js
var DraftMirror = require('draftmirror');
var schema = DraftMirror.schema;

var MyWidgetComponent = React.createClass({
    render: function() {
        return <div>...</div>;
    }
});

var MyWidget = DraftMirror.createWidget({
    component: MyWidgetComponent
});

const mySchema = new Schema({
    nodes: schema.nodeSpec.addBefore('image', 'mywidget', {
        type: MyWidget, group: "inline"
    }),
    marks: schema.markSpec
});
```

##### Tooltips

You can ask to render tooltips by providing a callback function as prop `getTooltip`. You callback should have such signature:

``` js
/**
 * Return tooltip depending on context
 *
 * @param {DraftMirror.SelectionContext} context The current context
 * @return {DraftMirror.Tooltip}
 */
function getTooltip(context) {
  return {
      component: <ReactComponent>,
      props:     <Object>
      position:  'bottom' | 'center' | 'right' | 'left',
      type:      'mark' | 'node',
      className: <String>, // Additionnal class for the div
  };
}

```
