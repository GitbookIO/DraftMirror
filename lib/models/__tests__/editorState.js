var expect = require('expect');

var EditorState = require('../editorState');
var rawSchema   = require('../../schemas/raw');


describe('EditorState', function() {

    describe('.createForText', function() {
        it('should create for a normal text', function() {
            var editorState = EditorState.createForText(rawSchema, 'Hello world');
            var doc = editorState.getDoc();
            expect(doc.nodeSize).toBe(15);
        });

        it('should create for an empty text', function() {
            var editorState = EditorState.createForText(rawSchema, '');
            var doc = editorState.getDoc();
            expect(doc.nodeSize).toBe(4);
        });
    });

    describe('.getContentAsPlainText', function() {
        it('should return correct for a normal text', function() {
            var TEXT = 'Hello world';
            var editorState = EditorState.createForText(rawSchema, TEXT);
            expect(editorState.getContentAsPlainText()).toBe(TEXT);
        });

        it('should return correct for an empty text', function() {
            var TEXT = '';
            var editorState = EditorState.createForText(rawSchema, TEXT);
            expect(editorState.getContentAsPlainText()).toBe(TEXT);
        });

        it('should return correct for multiline text', function() {
            var TEXT = 'Hello\n\nWorld\nCool?';
            var editorState = EditorState.createForText(rawSchema, TEXT);
            expect(editorState.getContentAsPlainText()).toBe(TEXT);
        });
    });

});

