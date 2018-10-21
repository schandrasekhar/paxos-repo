var express = require('express');
var db = require('./db');
var bodyParser = require('body-parser');
const crypto = require('crypto');


var port = 3000;
var app = express();

const createSha = function(data) {
    try {
        const msg = data.toString();
        return crypto.createHash('sha256').update(msg, 'utf8').digest('hex');
    } catch (error) {
        console.error(error);
        return null;
    }
    
};

const storeInDb = function(sha, message) {
    const data = {};
    data[sha] = message;
    return db.save(data);
};

app.use(bodyParser.json());

//to serve static files
app.use(express.static(__dirname + '/build/'));

app.post('/messages', function(req, res) {
    const message = req.body.message;
    if (message) {
        const sha = createSha(message);
        if (sha) {
            const payload = {
                "digest": sha
            };
            storeInDb(sha, message);
            return res.send(payload);
        }
        return res.status(500).send('error occurred');
    }
    return res.status(400).send("please provide a message for encryption");
});


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


app.listen(3000, function() {
    console.log('Example app listening on port 3000!');
});