var React = require('react');
var ReactDOM = require('react-dom');
var models = require('prosemirror/dist/model');
var dom = require('prosemirror/dist/util/dom');

var WidgetSpec = require('./spec');

/**
 * Create a prosemirror type for a widget using a spec.
 *
 * @param  {WidgetSpec} spec
 * @return {prosemirror.Type}
 */
function createWidget(spec) {
    spec = WidgetSpec.create(spec);

    var Base = spec.isInline()? models.Inline : models.Block;
    var Component = spec.getComponent();
    var attrs = spec.getAttrs()
        .map(function(def) {
            return new models.Attribute(def);
        })
        .toJS();

    function CustomType() {
        Base.apply(this, arguments);
    }
    CustomType.prototype = Object.create(Base.prototype);

    /* Object.defineProperty(CustomType.prototype, 'matchDOMTag', {
        get: function() {
            return {
                'figure': function(dom) {
                    var className = dom.hasAttribute('class')? dom.getAttribute('class') : '';
                    return className.indexOf('Widget-' + this.name) >= 0? {} : false;
                }
            };
        }
    }); */

    Object.defineProperty(CustomType.prototype, 'attrs', {
        get: function() {
            return attrs;
        }
    });

    CustomType.prototype.toDOM = function(node) {
        if (node.rendered) {
            node.rendered = node.rendered.cloneNode(true);
        } else {
            var isInline = spec.isInline(node);

            node.rendered = dom.elt('figure', {
                class: 'DraftMirror-Widget Widget-' + this.name + ' ' + (isInline? 'inline' : 'block')
            }, '');

            var el = React.createElement(Component, {
                attrs:  node.attrs,
                inline: isInline
            });

            ReactDOM.render(el, node.rendered);
        }
        return node.rendered;
    };

    return CustomType;
}

module.exports = createWidget;
