const db = {};


db.save = function(data) {
    const keys = Object.keys(data);
    keys.forEach(function(key) {
        db[key] = data[key];
    });
    return true;
};

db.get = function(key) {
    return db[key];
};

db.delete = function(key) {
    try {
        delete db[key];
        return true;
    } catch (error) {
        console.error(error);
        return false;
    }
};

module.exports = db;