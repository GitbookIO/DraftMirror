module.exports = {
    'content': [
        {
            'type': 'heading',
            'attrs': {
                'level': 2
            },
            'content': [
                {
                    'type': 'text',
                    'text': 'Hello #World!'
                }
            ]
        },
        {
            'type': 'code_block',
            'content': [
                {
                    'type': 'text',
                    'text': 'Hello '
                }
            ]
        },
        {
            'type': 'paragraph',
            'content': [
                {
                    'type': 'text',
                    'text': 'Hello '
                },
                {
                    'type': 'text',
                    'text': 'World',
                    'marks': [
                        {
                            '_': 'link',
                            'href': 'https://github.com/GitbookIO/DraftMirror'
                        }
                    ]
                },
                {
                    'type': 'math',
                    'attrs': {
                        tex: 'a = 4'
                    }
                }
            ]
        },
        {
            'type': 'horizontal_rule'
        },
        {
            'type': 'paragraph',
            'content': [
                {
                    'type': 'image',
                    'attrs': {
                        'src': 'http://prosemirror.net/img/logo.png'
                    }
                }
            ]
        }
    ],
    'type': 'doc'
};
