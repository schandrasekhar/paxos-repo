const express = require('express');
const db = require('./db');
const bodyParser = require('body-parser');
const sha = require('./sha');


const port = 3000;
const app = express();

/*
    Notes:
    Possible Bottlenecks
    1. If the rps is a lot the app can to scaled horizontally.
    2. If the string is very big, then the hash can be handed of to a off stage job. The client can keep polling the server
        for the result or in case of web sockets the server can respond back with the data when available. Another optimization
        can be to scale the app horizontally. A restriction on the string size can also be enforced so as the client does not
        abuse the micro service.
    3. In case of more users the hardware can also be upgraded (if possible) to handle more rps
    4. Another optimization can be to spawn a pool of worker threads that do hashing, so as to handle peak loads.
        The pool configuration can be tweaked for the required rps from a single box.
    5. The box handling the requests can be different from the box handling the hashing so each component can be fine grained
    control over scaling can be achieved as per need.
    6. I have used an in memory hashmap for saving the hashes, a redis cache (or) a persistent database can be used based on the usecase
*/


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