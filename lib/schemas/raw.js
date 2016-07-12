var model    = require('prosemirror/dist/model');
var Schema   = model.Schema;
var Text     = model.Text;

var SCHEMA_BASIC   = require('prosemirror/dist/schema-basic');
var Doc            = SCHEMA_BASIC.Doc;
var Paragraph      = SCHEMA_BASIC.Paragraph;

module.exports = new Schema({
    nodes: {
        doc: {type: Doc, content: 'block+'},
        unstyled: {type: Paragraph, content: 'inline*', group: 'block'},
        text: {type: Text, group: 'inline'}
    },
    marks: {}
});
