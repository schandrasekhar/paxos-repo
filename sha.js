const crypto = require('crypto');


const sha = {
    create: function(data) {
        try {
            const msg = data.toString();
            return crypto.createHash('sha256').update(msg, 'utf8').digest('hex');
        } catch (error) {
            console.error(error);
            return null;
        }
    }
};

module.exports = sha;