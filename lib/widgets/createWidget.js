var util = require('util');
var React = require('react');
var ReactDOM = require('react-dom');
var models = require('prosemirror/dist/model');
var dom = require('prosemirror/dist/util/dom');

var WidgetSpec = require('./spec');

/**
 * Create a widegt prosemirror type from a spec
 * @param  {Object} spec
 * @return {prosemirror.Type}
 */
function createWidget(spec) {
    spec = WidgetSpec.create(spec);

    var Base = spec.isInline()? models.Inline : models.Block;
    var Component = spec.getComponent();
    var attrs = spec.getAttrs()
        .map(function() {
            return new models.Attribute
        })
        .toJS();

    class CustomType extends Base {
        toDOM(node, s){
            if (node.rendered) {
                node.rendered = node.rendered.cloneNode(true)
            } else {
                node.rendered = dom.elt('div', {
                    class: 'DraftMirror-Widget ' + (spec.isInline()? 'inline' : 'block')
                }, '');

                var el = React.createElement(Component, {
                    text: node.text,
                    attrs: node.attrs
                });

                ReactDOM.render(el, node.rendered);
            }
            return node.rendered;
        }
        get attrs() {
            return attrs
        }
    }

    return CustomType;
}

module.exports = createWidget;
