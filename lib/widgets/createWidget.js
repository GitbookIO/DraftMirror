var util = require('util');
var React = require('react');
var ReactDOM = require('react-dom');
var models = require('prosemirror/dist/model');
var dom = require('prosemirror/dist/util/dom');

var WidgetSpec = require('./spec');

/**
 * Create a prosemirror type for a widget using a spec.
 * @param  {Object} spec
 * @return {prosemirror.Type}
 */
function createWidget(spec) {
    spec = WidgetSpec.create(spec);

    var Base = spec.isInline()? models.Inline : models.Block;
    var Component = spec.getComponent();
    var attrs = spec.getAttrs()
        .map(function(def) {
            return new models.Attribute(def)
        })
        .toJS();

    class CustomType extends Base {
        /*get matchDOMTag() {
            return {
                'figure': function(dom) {
                    var className = dom.hasAttribute('class')? dom.getAttribute('class') : '';
                    return className.indexOf('Widget-' + this.name) >= 0? {} : false;
                }
            };
        }*/

        toDOM(node, s){
            if (node.rendered) {
                node.rendered = node.rendered.cloneNode(true);
            } else {
                node.rendered = dom.elt('figure', {
                    class: 'DraftMirror-Widget Widget-' + this.name + ' ' + (spec.isInline()? 'inline' : 'block'),
                }, '');

                var el = React.createElement(Component, {
                    attrs:  node.attrs,
                    inline: spec.isInline()
                });

                ReactDOM.render(el, node.rendered);
            }
            return node.rendered;
        }
        get attrs() {
            return attrs;
        }
    }

    return CustomType;
}

dom.insertCSS(`
.DraftMirror-Widget.inline {
    display: inline-block;
}

.DraftMirror-Widget.block {
    display: block;
}`);

module.exports = createWidget;
