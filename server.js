'use strict';

const express = require('express');
var jsdom = require("jsdom");

// Constants
const PORT = 8080;

// App
const app = express();
app.get('/', function (req, res) {
    var deltaData = JSON.parse(req.query.delta);
    console.log(deltaData);

    jsdom.env({
        html: '<div id="editor-container"></div>',
        scripts: [
            'https://cdnjs.cloudflare.com/ajax/libs/webcomponentsjs/0.7.22/MutationObserver.js',
            'https://cdn.quilljs.com/1.0.4/quill.js'],
        onload: function (window) {
            try {
                var document = window.document;
                // fake getSelection
                // https://github.com/tmpvar/jsdom/issues/317
                document.getSelection = function() {
                    return {
                        getRangeAt: function() {}
                    };
                };

                var container = window.document.getElementById("editor-container");
                var quill = new window.Quill(container, {});
                quill.setContents(deltaData);

                res.send(document.querySelector(".ql-editor").innerHTML);
            } catch (exception) {
                res.send("SyntaxError");
            }
        }
    });
});

app.listen(PORT);
console.log('Running on http://localhost:' + PORT);