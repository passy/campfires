/**
 * welchat/server
 * ~~~~~~~~~~~~~~
 * 
 * A very, very simple Comet based chat.
 *
 * :copyright: 2010, Pascal Hartig <phartig@rdrei.net>
 * :license: MIT, see doc/LICENSE for more details.
 */

/*global require */
/*jslint white: true, onevar: false, browser: true, undef: true, nomen: true, eqeqeq: true, plusplus: true, bitwise: true, regexp: true, strict: true, newcap: true */
"use strict";

var serverlib = require('./serverlib');
var qs = require('querystring');
var url = require('url');
var callbacks = [];
var messages = [];

serverlib.get('/', serverlib.staticHandler("static/index.html"));
serverlib.get('/recv', function (req, res) {
    callbacks.push(function () {
        // We could use the timestamp to only send messages the client did not
        // receive yet.
        res.simpleJSON(200, messages);
    });
});
serverlib.get('/send', function (req, res) {
    var now = new Date(),
        params = qs.parse(url.parse(req.url).query);

    if (params.message === null) {
        res.simpleJSON(400, {
            error: "Please provide a message!"
        });
    }

    messages.push({
        'date': [now.getHours().toString(),
            now.getMinutes().toString(),
            now.getSeconds().toString()].join(':'),
        'message': params.message,
        'timestamp': now.getTime()
    });

    // Send out the messages.
    while (callbacks.length > 0) {
        callbacks.shift()();
    }
});
serverlib.listen(8001, null);
