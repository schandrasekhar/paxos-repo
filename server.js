const express = require('express');
const db = require('./db');
const bodyParser = require('body-parser');
const sha = require('./sha');


const port = 3000;
const app = express();


/*
    Middleware for routes
*/
//middleware to parse the payload in POST request
app.use(bodyParser.json());


/*
    This creates and returns in the response body a sha256 `key` with the given `message`
*/
app.post('/messages', function(req, res) {
    const message = req.body.message;
    if (message) {
        const shaKey = sha.create(message);
        if (shaKey) {
            const payload = {
                "digest": shaKey
            };
            db.save(shaKey, message);
            return res.send(payload);
        }
        return res.status(500).send('error occurred');
    }
    return res.status(400).send("please provide a message for encryption");
});


/*
    This retrieves the respective `message` given a sha256 `key`
*/
app.get('/messages/:sha', function(req, res) {
    const sha = req.params.sha;
    const message = db.get(sha);
    if (message) {
        res.send({
            message: message
        });
    } else {
        res.status(404).send("not found");
    }
});


app.listen(port, function() {
    console.log('Example app listening on port ' + port );
});

module.exports = app;